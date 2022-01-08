
use neon::prelude::*;
use std::fs::File;
use std::io::Write;

use crate::utility::create_bib_string;
use crate::datatypes::bibentry::BibEntry;

pub fn write_entries_to_file(entries: Vec<BibEntry>, path: String) -> NeonResult<bool> {
    let mut file = File::create(path).expect("Failed To Create File!");
    let bib = create_bib_string(entries)?;
    file.write_all(bib.as_bytes()).expect("Failed to write string to file!");

    Ok(true)
}

