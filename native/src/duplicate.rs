use neon::prelude::*;
use crate::datatypes::bibentry::BibEntry;

pub fn remove_direct_duplicates(entries: Vec<BibEntry>) -> NeonResult<Vec<BibEntry>> {
    let mut entries_cleaned: Vec<BibEntry> = Vec::new();

    for entry in entries.iter() {
        if !entries_cleaned.contains(entry) {
            entries_cleaned.push(entry.clone())
        }
    }

    Ok(entries_cleaned)
}