use crate::datatypes::bibentry::BibEntry;
use crate::datatypes::field::Field;
use crate::error::{print_error_message};
use crate::parser::bibtex_sanitiser;
use neon::prelude::*;
use std::str::Chars;

#[derive(Debug, Clone)]
pub struct ParseResult {
    pub bibtex_entries: Vec<BibEntry>,
    pub result: bool
}

pub fn parse_bibtex_string(bibtex_string: String) -> NeonResult<ParseResult> {
    let bibtex_string_clean = bibtex_sanitiser::clean_bibtex(bibtex_string)?;

    let bibtex_entries: ParseResult = parse_entries(bibtex_string_clean)?;

    Ok(bibtex_entries)
}

fn parse_entries(bibtex_string: String) -> NeonResult<ParseResult> {
    let entries_iter = bibtex_string.split("@");
    let mut entries_parsed: Vec<BibEntry> = Vec::new();

    let mut parse_success = true;

    for entry in entries_iter {
        if !entry.is_empty() {
            match parse_entry(entry.to_string()) {
                Ok(bib_entry_no_error) => entries_parsed.push(bib_entry_no_error),
                // ignore error and continue to parse rest of file
                Err(_) => {
                    parse_success = false;
                    continue;
                },
            };
        }
    }

    Ok(ParseResult {
        bibtex_entries: entries_parsed,
        result: parse_success
    })
}

fn parse_entry(entry_string: String) -> NeonResult<BibEntry> {
    if !bibtex_sanitiser::is_properly_formatted(&entry_string) || entry_string.trim().is_empty() {
        // debugging
        // print_error_message(format!("IMPROPERLY FORMATTED ENTRY:\n{}\n", entry_string));
        return Err(neon::result::Throw);
    }

    let entry_iterator = entry_string.chars();
    let entry = consume_entry_type(entry_iterator)?;
    
    Ok(entry)
}

fn consume_entry_type(mut entry_iterator: Chars) -> NeonResult<BibEntry> {
    let mut entry_type = String::new();
    let mut current: char =  entry_iterator.next().unwrap();

    while current != '{' {
        entry_type.push(current);    
        current =  entry_iterator.next().unwrap();
    }

    if entry_type.to_lowercase() == "preamble" {
        // return out of parsing this entry
        return Err(neon::result::Throw)
    }

    consume_entry_name(entry_iterator, entry_type)
}

fn consume_entry_name(mut entry_iterator: Chars, entry_type: String) -> NeonResult<BibEntry> {
    let mut name = String::new();
    let mut current: char = entry_iterator.next().unwrap();
    while current != ',' {
        name.push(current);
        current  = match entry_iterator.next() {
            Some(c) => c,
            None => return Err(neon::result::Throw)
        }
    }

    consume_fields(entry_iterator, entry_type, name)
}

// Disgusting function :)) TODO: Break this function down (might be very difficult due to iterator)
fn consume_fields(entry_iterator: Chars, entry_type: String, name: String) -> NeonResult<BibEntry> {
    // let mut fields_string = entry_iterator.as_str().trim();
    // // remove last char
    // fields_string = &fields_string[..fields_string.len() - 1];
    
    let mut fields: Vec<Field> = Vec::new();

    // flags
    let mut is_field_name = true;
    let mut is_char_escape = false;

    let mut field_name = String::new();
    let mut field_value = String::new();

    let mut bracket_count = 0;
    let mut quote_count = 0;

    for c in entry_iterator {
        if c == '\n' {
            // skip whitespace
            continue;
        } else if c == '{' && !is_char_escape {
            if bracket_count != 0 {
                field_value.push(c);
            }
            bracket_count+=1;
        } else if c == '}' && !is_char_escape {
            bracket_count-=1;
            if bracket_count != 0 {
                field_value.push(c);
            }
        } else if c == '"' && !is_char_escape {
            quote_count+=1;
        } else if c == '\\' {
            is_char_escape = true;
        } else if c == '=' && is_field_name {
            is_field_name = false;
            continue;
          // , is the delimiter (except when inside brackets or quotes for value)  
        } else if c == ',' && bracket_count == 0  && quote_count % 2 == 0 && !is_field_name {
            // field complete
            fields.push(Field {
                            field_name: field_name.clone().trim().to_string(),
                            field_value: field_value.clone().trim().to_string()
                        });
            // reset values
            field_name = String::new();
            field_value = String::new();
            bracket_count=0;
            quote_count=0;


            // swap flags
            is_field_name = true;
            continue;
        } else {
            // otherwise normal char
            is_char_escape = false;
            if is_field_name {
                field_name.push(c);
            } else {
                field_value.push(c);
            }   
        }
    }

    Ok(BibEntry {
        entry_type: entry_type,
        name: name,
        fields: fields
    })
}

fn _split_on_first_bracket(entry_string: &str) -> NeonResult<(String, String)> {
    let (first, last) = match entry_string.find('{') {
        Some(first_curly_index) => 
            entry_string.split_at(first_curly_index),
        None => return Err(neon::result::Throw)
    };

    Ok((first.to_string(), last.to_string()))
}