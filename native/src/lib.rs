use neon::prelude::*;
use glob::glob;
use std::path::PathBuf;
use std::env;

fn search_volume(mut cx: FunctionContext) -> JsResult<JsString> {
    let path_handle = cx.argument::<JsString>(0)?;
    let path_list: Vec<PathBuf> = get_all_bibtex_files(path_handle.value(&mut cx))?;

    for path in path_list {
        println!("{}", path.display())
    }

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

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("searchVolume", search_volume)?;
    Ok(())
}
