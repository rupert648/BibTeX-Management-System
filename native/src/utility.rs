use neon::prelude::*;
use std::fs;
use std::path::PathBuf;

use crate::parser::bibtex_parser::ParseResult;
use crate::datatypes::bibentry::BibEntry;

pub fn js_string_array_to_vec(js_array: Handle<JsArray>, cx: &mut FunctionContext) -> NeonResult<Vec<String>> {
    // convert to string vec
    let js_vec: Vec<Handle<JsValue>> = js_array.to_vec(cx)?;
    let mut string_vec: Vec<String> = Vec::new();
    for (_, item) in js_vec.iter().enumerate() {
        let js_string = item.downcast::<JsString, FunctionContext>(cx).unwrap();
        string_vec.push(js_string.value(cx));
    }

    Ok(string_vec)
}

pub fn read_files_into_strings(path_list: Vec<String>) -> NeonResult<Vec<String>> {
    let mut file_contents: Vec<String> = Vec::new();

    // Read all files as strings
    for path in path_list {
        let file_content = fs::read_to_string(path).expect("Something went wrong reading a file");
        file_contents.push(file_content);
    }

    Ok(file_contents)
}

pub fn is_files_all_valid(path_list: &Vec<String>) -> bool {
    for path in path_list {
        let pathbuf = PathBuf::from(path);
        if pathbuf.extension().unwrap() != "bib" {
            return false
        }
    }

    true
}

pub fn create_bib_string(entries: Vec<BibEntry>) -> NeonResult<String> {
    let mut bib = String::new();

    for entry in entries {
        bib.push_str(&entry.to_string());
        bib.push('\n');
    }

    Ok(bib)
}

pub fn is_file_valid(path: &str) -> bool {
    let pathbuf = PathBuf::from(path);
    pathbuf.extension().unwrap() == "bib"
}

pub fn create_entries_return_object<'a>(entries: ParseResult, cx: &mut FunctionContext<'a>) -> JsResult<'a, JsObject> {
    let obj = cx.empty_object();

    let status = cx.string(if entries.result { "OK" } else { "BAD_ENTRY"});
    obj.set(cx, "status", status)?;

    let js_arr = JsArray::new(cx, entries.bibtex_entries.len() as u32);
    for (i, entry) in entries.bibtex_entries.iter().enumerate() {
        let obj = entry.to_object(cx)?;
        js_arr.set(cx, i as u32, obj)?;
    }

    obj.set(cx, "entries", js_arr)?;

    Ok(obj)
}

pub fn create_success_return_object<'a>(cx: &mut FunctionContext<'a>) -> JsResult<'a, JsObject> {
    let obj = cx.empty_object();
    
    let status = cx.string("OK");
    obj.set(cx, "status", status)?;

    let message = cx.string("File written to successfully");
    obj.set(cx, "message", message)?;

    Ok(obj)
}

pub fn read_file(path: String) -> NeonResult<String> {
    let file_content = fs::read_to_string(path).expect("Something went wrong reading the file");

    Ok(file_content)
}

pub fn get_file_size(path: String) -> NeonResult<f64> {
    let result = fs::metadata(path).unwrap().len();
    Ok(result as f64)
}
