use neon::prelude::*;

pub fn create_error_object<'a>(error_message: String, cx: &mut FunctionContext<'a>) -> JsResult<'a, JsObject> {
    let err = cx.empty_object();

    let status = cx.string("ERR");
    err.set(cx, "status", status)?;
    let js_error_message = cx.string(error_message);
    err.set(cx, "errMessage", js_error_message)?;

    Ok(err)
}

// debugging
pub fn print_error_message(error_message: String) {
    println!("----------\nerror: \n{}\n---------", error_message)
}