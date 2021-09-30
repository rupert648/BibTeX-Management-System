use neon::prelude::*;
use glob::glob;
use std::path::PathBuf;
use std::env;
use std::fs;

mod datatypes;

// Will Change result type later
fn search_volume(mut cx: FunctionContext) -> JsResult<JsString> {
    let path_handle = cx.argument::<JsString>(0)?;
    let path_list: Vec<PathBuf> = get_all_bibtex_files(path_handle.value(&mut cx))?;
    let bib_file_contents: Vec<String> = read_all_bibtex_files(path_list)?;

    let a = datatypes::BibEntry::default();
    println!("{:?}", a);

    Ok(path_handle)
}

fn get_all_bibtex_files(file_path: String) -> NeonResult<Vec<PathBuf>> {
    
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

fn read_all_bibtex_files(path_list: Vec<PathBuf>) -> NeonResult<Vec<String>> {

    let mut file_contents: Vec<String> = Vec::new();

    // Read all files as strings
    for path in path_list {
        let file_content = fs::read_to_string(path).expect("Something went wrong reading a file");
        file_contents.push(file_content);
    }

    Ok(file_contents)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("searchVolume", search_volume)?;
    Ok(())
}
