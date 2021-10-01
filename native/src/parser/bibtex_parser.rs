use crate::datatypes::bibentry::BibEntry;
use neon::prelude::*;

pub fn parse_bibtex_string(bibtex_string: String) -> NeonResult<Vec<BibEntry>> {
    let bibtex_string_clean = clean_bibtex(bibtex_string)?;

    let entries_iter = bibtex_string_clean.split("@");
    let mut entries: Vec<&str> = entries_iter.collect();
    // remove empty entries
    entries.retain(|&entry| entry != "");

    for (index, entry) in entries.iter().enumerate() {
        println!("{}: <{}>\n", index, entry);
    }

    Ok(Vec::new())
}

pub fn clean_bibtex(bibtex_string: String) -> NeonResult<String> {
    let lines = bibtex_string.split("\n");
    let mut lines_vec: Vec<&str> = lines.collect();
    
    // retains only non comments and non-empty lines
    lines_vec.retain(|&line| 
        line != "" && 
        !is_comment(line)
    );

    // return rejoin strings
    Ok(lines_vec.join("\n"))
}


// luckily for us a comment in bibtex must be a whole line
fn is_comment(line: &str) -> bool {
    let trimmed = line.trim();
    let first_char = trimmed.chars().next().unwrap();

    first_char == '%'
}