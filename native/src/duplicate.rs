use neon::prelude::*;
use crate::datatypes::bibentry::BibEntry;
use crate::string_matchers::jenson_shanning_vector;

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

    let mut is_removed_arr: Vec<bool> = Vec::new();
    // instantiate array
    for _i in 0..entries.len() {
        is_removed_arr.push(false);
    }

    for i in 0..entries.len() {

        if is_removed_arr[i] { continue; }

        for j in (i+1)..entries.len() {

            if is_removed_arr[j] { continue; }

            let entry1 = entries.get(i).unwrap();
            let entry2 = entries.get(j).unwrap();

            let entry1_str = entry1.to_string();
            let entry2_str = entry2.to_string();

            // compute difference score
            let score = jenson_shanning_vector::compute(&entry1_str, &entry2_str); 
            
            // then too similar
            if score < threshold {
                // set isRemoved to true (for latter, we keep the first in the array)
                is_removed_arr[j] = true;
            }
        }
    }

    // put new values in arr
    for (index, entry) in entries.iter().enumerate() {
        if !is_removed_arr[index] { entries_cleaned.push(entry.clone()); }
    }
    
    Ok(entries_cleaned)
}