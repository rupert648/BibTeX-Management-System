use neon::prelude::*;

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    let path: Handle<JsValue> = cx.argument(0)?;

    let path_string = path.downcast::<JsString, FunctionContext>(&mut cx).unwrap();

    println!("{}", path_string.value(&mut cx));

    Ok(path_string)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("hello", hello)?;
    Ok(())
}
