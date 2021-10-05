use crate::datatypes::bibentry::BibEntry;
use crate::utility::{print_error_message};
use crate::parser::bibtex_sanitiser;
use neon::prelude::*;

pub fn parse_bibtex_string(bibtex_string: String) -> NeonResult<Vec<BibEntry>> {
    let bibtex_string_clean = bibtex_sanitiser::clean_bibtex(bibtex_string)?;

    let bibtex_entries: Vec<BibEntry> = parse_entries(bibtex_string_clean)?;


    // let mut entries: Vec<&str> = entries_iter.collect();
    // // remove empty entries
    // entries.retain(|&entry| entry != "");

    // for (index, entry) in entries.iter().enumerate() {
    //     println!("{}: <{}>\n", index, entry);
    // }

    Ok(Vec::new())
}

fn parse_entries(bibtex_string: String) -> NeonResult<Vec<BibEntry>> {
    let entries_iter = bibtex_string.split("@");
    let mut entries_parsed: Vec<BibEntry> = Vec::new();

    for entry in entries_iter {
        if !entry.is_empty() {
            match parse_entry(entry.to_string()) {
                Ok(bib_entry_no_error) => entries_parsed.push(bib_entry_no_error),
                Err(_) => continue,
            };
        }
    }

    Ok(Vec::new())
}

fn parse_entry(entry_string: String) -> NeonResult<BibEntry> {
    if !bibtex_sanitiser::is_properly_formatted(&entry_string) {
        print_error_message(format!("IMPROPERLY FORMATTED ENTRY:\n{}\n", entry_string));
        return Err(neon::result::Throw);
    }

    let entry_type = get_entry_type(&entry_string)?;
    println!("{}", entry_type);
    // let name = get_entry_name(&entry_string);
    // let fields = get_entry_fields(&entry_string);
    
    Ok(BibEntry::default())
}

fn get_entry_type(entry_string: &str) -> NeonResult<String> {
    let (first, _last) = match entry_string.find('{') {
        Some(first_curly_index) => 
            entry_string.split_at(first_curly_index),
        None => return Err(neon::result::Throw)
    };

    // TODO: Check if valid entry type?
    Ok(first.to_string())
}
