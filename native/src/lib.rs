use neon::prelude::*;
use glob::glob;
use std::path::PathBuf;

mod datatypes;
mod utility;
mod parser;

// Will Change result type later
fn search_volume(mut cx: FunctionContext) -> JsResult<JsArray> {
    let path_handle = cx.argument::<JsString>(0)?;
    let path_list: Vec<PathBuf> = get_all_bibtex_files(path_handle.value(&mut cx))?;

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

fn merge_bibtex_files(mut cx: FunctionContext) -> JsResult<JsString> {
    let path_list_js_array = cx.argument::<JsArray>(0)?;
    let path_list = utility::js_string_array_to_vec(path_list_js_array, &mut cx)?;
    let file_contents = utility::read_files_into_strings(path_list)?;

    for file_content in file_contents {
        // TODO: Create parser
        // bibtex_parser::parse_file_string(file_content)
        parser::bibtex_parser::parse_bibtex_string(file_content);
    }

    let return_value: Handle<JsString> = cx.string("Temp return value");
    Ok(return_value)
}


#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("searchVolume", search_volume)?;
    cx.export_function("mergeBibTexFiles", merge_bibtex_files)?;
    Ok(())
}
