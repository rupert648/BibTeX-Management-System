use neon::prelude::*;
use std::fs;


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

pub fn read_file(path: String) -> NeonResult<String> {
    let file_content = fs::read_to_string(path).expect("Something went wrong reading the file");

    Ok(file_content)
}

pub fn print_error_message(error_message: String) {
    println!("----------\nerror: \n{}\n---------", error_message)
}