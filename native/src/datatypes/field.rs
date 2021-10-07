use neon::prelude::*;

#[derive(Debug)]
pub struct Field {
    pub field_name: String,
    pub field_value: String
}

impl Field {
    pub fn to_object<'a>(&self, cx: &mut FunctionContext<'a>) -> JsResult<'a, JsObject> {
        let obj = cx.empty_object();

        let field_name = cx.string(self.field_name.clone());
        obj.set(cx, "fieldName", field_name)?;

        let field_value = cx.string(self.field_value.clone());
        obj.set(cx, "fieldValue", field_value)?;

        Ok(obj)
    }
}