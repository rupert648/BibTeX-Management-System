use neon::prelude::*;
use crate::datatypes::bibentry::BibEntry;
use crate::jenson_shanning_vector;

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
    // TODO: remove any none ASCII chars to make jenson shanning not break
    let mut entries_cleaned: Vec<BibEntry> = Vec::new();

    let mut is_removed_arr: Vec<bool> = Vec::new();
    // instantiate array
    for _i in 0..entries.len() {
        is_removed_arr.push(false);
    }

    for i in 0..entries.len() {

        // TODO: worth removing this line?
        if is_removed_arr[i] { continue; }

        for j in (i+1)..entries.len() {

            if is_removed_arr[j] { continue; }

            let entry1 = entries.get(i).unwrap();
            let entry2 = entries.get(j).unwrap();

            // grab relevant fields
            let entry1_author = entry1.get_field("author");
            let entry1_title = entry1.get_field("title");

            let entry2_author = entry2.get_field("author");
            let entry2_title = entry2.get_field("title");
            
            let author_score = jenson_shanning_vector::compute(&entry1_author, &entry2_author);
            let title_score = jenson_shanning_vector::compute(&entry1_title, &entry2_title); 
            
            // compute average score
            let score = (author_score + title_score) / 2.0;

            // then too similar
            if score < threshold {
                println!("Entry1 {:?}", entry1);
                println!("Entry2 {:?}", entry2);
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