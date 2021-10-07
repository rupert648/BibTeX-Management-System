use neon::prelude::*;
use std::path::PathBuf;
use crate::datatypes::bibentry::BibEntry;

mod datatypes;
mod utility;
mod parser;
mod volume_search;

// Will Change result type later
fn search_volume(mut cx: FunctionContext) -> JsResult<JsArray> {
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

// takes an array of bibtex file paths and merges them into one bibtex file
// TODO:
fn merge_bibtex_files(mut cx: FunctionContext) -> JsResult<JsString> {
    let path_list_js_array = cx.argument::<JsArray>(0)?;

    let path_list = utility::js_string_array_to_vec(path_list_js_array, &mut cx)?;
    let file_contents = utility::read_files_into_strings(path_list)?;

    let mut entries: Vec<BibEntry> = Vec::new();
    for file_content in file_contents {
        entries = parser::bibtex_parser::parse_bibtex_string(file_content)?;
    }

    println!("{:?}", entries);

    let return_value: Handle<JsString> = cx.string("Temp return value");
    Ok(return_value)
}

fn parse_bibtex_file(mut cx: FunctionContext) -> JsResult<JsArray> {
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
