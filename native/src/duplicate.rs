use std::ops::Rem;

use neon::prelude::*;
use crate::datatypes::bibentry::BibEntry;
use crate::string_matchers::jenson_shanning_vector;

struct BibEntryIsRemoved {
    entry: BibEntry,
    isRemoved: bool
}

pub fn remove_direct_duplicates(entries: Vec<BibEntry>) -> NeonResult<Vec<BibEntry>> {
    let mut entries_cleaned: Vec<BibEntry> = Vec::new();

    // simply checks for duplicates
    for entry in entries.iter() {
        if !entries_cleaned.contains(entry) {
            entries_cleaned.push(entry.clone())
        }
    }

    Ok(entries_cleaned)
}

pub fn remove_highly_similar_duplicates(entries: Vec<BibEntry>, threshold: f64) -> NeonResult<Vec<BibEntry>> {
    let mut entries_cleaned: Vec<BibEntry> = Vec::new();

    let mut entry_iter_array: Vec<BibEntryIsRemoved> = entries
        .into_iter()
        .map(|entry| BibEntryIsRemoved {entry: entry, isRemoved: false})
        .collect();

    for i in 0..entry_iter_array.len() {
        for j in (i+1)..entry_iter_array.len() {

            let entry1 = entry_iter_array.get(i).unwrap().entry;
            let entry2 = entry_iter_array.get(j).unwrap().entry;

            let entry1_str = entry1.to_string();
            let entry2_str = entry2.to_string();

            let score = jenson_shanning_vector::compute(&entry1_str, &entry2_str); 
            
            if score > threshold {
                // set isRemoved to true
            }
        }
    }
    
    Ok(Vec::new())
}