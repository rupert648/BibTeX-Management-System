
use neon::prelude::*;
use std::fs::File;
use std::io::Write;

use crate::datatypes::bibentry::BibEntry;

pub fn write_entries_to_file(entries: Vec<BibEntry>, path: String) -> NeonResult<bool> {
    let mut file = File::create(path).expect("Failed To Create File!");
    let bib = create_bib_string(entries)?;
    file.write_all(bib.as_bytes()).expect("Failed to write string to file!");

    Ok(true)
}

fn create_bib_string(entries: Vec<BibEntry>) -> NeonResult<String> {
    let mut bib = String::new();

    for entry in entries {
        bib.push_str(&entry.to_string());
        bib.push('\n');
    }

    Ok(bib)
}