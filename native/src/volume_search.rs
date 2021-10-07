use neon::prelude::*;
use std::path::PathBuf;
use glob::glob;

pub fn get_all_bibtex_files(file_path: String) -> NeonResult<Vec<PathBuf>> {
    
    let bibtex_glob_string = "**/*.bib";
    let glob_path: String = format!("{}/{}", file_path, bibtex_glob_string);

    let mut relative_path_list: Vec<PathBuf> = Vec::new();

    for entry in glob(&glob_path).expect("Bad Glob Pattern") {
        match entry {
            Ok(entry_value) => 
                relative_path_list.push(entry_value),
            Err(_e) => ()
        };
    }    

    Ok(relative_path_list)
}