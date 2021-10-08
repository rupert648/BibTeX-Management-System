#![warn(missing_docs)]

//! This crate contains "JS functions" for neon, allowing the user to read, merge and collate BibTex Files

use neon::prelude::*;
use std::path::PathBuf;
use crate::datatypes::bibentry::BibEntry;

mod datatypes;
mod utility;
mod parser;
mod volume_search;
mod error;

/// Searches a given path and its sub directories for .bib files.
///
/// Given that the argument is not a JSString, an error will be thrown to the
/// javascript runtime. If the path does not exist or is improperly formatted. An error will
/// be thrown to the javascript runtime. **Note this can only be called from the JS Runtime**
pub fn search_volume(mut cx: FunctionContext) -> JsResult<JsArray> {
    let path_handle = cx.argument::<JsString>(0)?;
    let path_list: Vec<PathBuf> = volume_search::get_all_bibtex_files(path_handle.value(&mut cx))?;

    // pass into JS Array
    let js_return_array = JsArray::new(&mut cx, path_list.len() as u32);
    for (i, s) in path_list.iter().enumerate() {
        let js_string = 
            cx.string(
                s.to_str()
                .expect("Failed to convert PathBuf to String")
            );
        js_return_array.set(&mut cx, i as u32, js_string)?;
    }

    Ok(js_return_array)
}

/// Given an array of file paths, merges these into a singular .bib file - removing any duplicates
/// 
/// Will parse these files, search all entries for duplicates or near duplicates, and then interact
/// with the user to decide how to handle all of these. **Note this can only be called from the JS Runtime**
pub fn merge_bibtex_files(mut cx: FunctionContext) -> JsResult<JsObject> {
    let path_list_js_array = cx.argument::<JsArray>(0)?;
    let path_list = utility::js_string_array_to_vec(path_list_js_array, &mut cx)?;

    if path_list.len() <= 1 {
        // TODO: Give the option still to merge with this
        return error::create_error_object(String::from("Only 1 File Submitted"), &mut cx)
    }
    if !utility::is_files_all_valid(&path_list) {
        return error::create_error_object(String::from("Invalid File Type Found"), &mut cx)
    }

    let file_contents = utility::read_files_into_strings(path_list)?;

    let mut entries: Vec<BibEntry> = Vec::new();
    for file_content in file_contents {
        let mut temp = parser::bibtex_parser::parse_bibtex_string(file_content)?;
        entries.append(&mut temp);
    }

    utility::create_entries_return_object(entries, &mut cx)
}

/// Given a .bib file path will parse it, and return the entries as a JS array of objects.
/// 
/// Given a .bib path it will parse the file, throwing an error if any sanitisation errors are found.
/// It will return the JS object from a Rust Struct, which for each entry has the following format:
/// ```
/// pub struct BibEntry {
///    pub entry_type: String,
///    pub name: String,
///    pub fields: Vec<Field>,
///}
/// ```
pub fn parse_bibtex_file(mut cx: FunctionContext) -> JsResult<JsArray> {
    // TODO: check all paths are .bib files
    let path_arg = cx.argument::<JsString>(0)?;
    let path = path_arg.value(&mut cx);

    let file_content = utility::read_file(path)?;
    let entries = parser::bibtex_parser::parse_bibtex_string(file_content)?;

    let return_arr = JsArray::new(&mut cx, entries.len() as u32);
    for (i, entry) in entries.iter().enumerate() {
        let obj = entry.to_object(&mut cx)?;
        return_arr.set(&mut cx, i as u32, obj)?;
    }

    Ok(return_arr)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("searchVolume", search_volume)?;
    cx.export_function("mergeBibTexFiles", merge_bibtex_files)?;
    cx.export_function("parseBibTexFile", parse_bibtex_file)?;
    Ok(())
}
