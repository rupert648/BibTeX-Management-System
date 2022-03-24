use std::hash::{Hash, Hasher};

use neon::prelude::*;

#[derive(Debug, Clone)]
pub struct Field {
    pub field_name: String,
    pub field_value: String
}

impl Hash for Field {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.field_name.hash(state);
        self.field_value.hash(state);
    }
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

    pub fn is_exact_same(&self, compared: &Field) -> bool {
        self.field_name == compared.field_name &&
        self.field_value == compared.field_value
    }
}