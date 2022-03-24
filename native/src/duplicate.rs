use std::collections::HashMap;

use neon::prelude::*;
use crate::datatypes::bibentry::BibEntry;
use crate::jensen_shannon_vector;

pub fn remove_direct_duplicates(entries: Vec<BibEntry>) -> NeonResult<Vec<BibEntry>> {
    let mut entries_hash: HashMap<BibEntry, i32> = HashMap::new();

    // simply checks for duplicates
    for entry in entries.iter() {
        // inserts the entry into the map if doesn't exist, then increments
        let counter = entries_hash.entry(entry.clone()).or_insert(0);
        *counter += 1;
    }

    // collect keys back into hash and return
    Ok(entries_hash.keys().cloned().collect::<Vec<BibEntry>>())
}



pub fn remove_highly_similar_duplicates(entries: Vec<BibEntry>, threshold: f64) -> NeonResult<Vec<BibEntry>> {
    let mut entries_cleaned: Vec<BibEntry> = Vec::new();

    let mut is_removed_arr: Vec<bool> = Vec::new();
    // instantiate array
    for _i in 0..entries.len() {
        is_removed_arr.push(false);
    }

    for i in 0..entries.len() {

        // if arr[i] = arr[j], then possible that arr[i] != arr[k]
        // but arr[j] = arr[k].
        // line below would prevent latter of two checks.
        
        // if is_removed_arr[i] { continue; }

        for j in (i+1)..entries.len() {

            if is_removed_arr[j] { continue; }

            let entry1 = entries.get(i).unwrap();
            let entry2 = entries.get(j).unwrap();

            // grab relevant fields
            let entry1_author = match entry1.get_field("author") {
                Some(val) => val,
                None => String::from("")
            };
            let entry1_title = match entry1.get_field("title") {
                Some(val) => val,
                None => String::from("")
            };

            let entry2_author = match entry2.get_field("author") {
                Some(val) => val,
                None => String::from("")
            };
            let entry2_title = match entry2.get_field("title") {
                Some(val) => val,
                None => String::from("")
            };
            
            let author_score = jensen_shannon_vector::compute(&entry1_author, &entry2_author);
            let title_score = jensen_shannon_vector::compute(&entry1_title, &entry2_title); 
            
            // compute average score
            let score = (author_score + title_score) / 2.0;

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