pub use crate::datatypes::field::Field;
use neon::prelude::*;

#[derive(Debug)]
pub struct BibEntry {
    pub entry_type: String,
    pub name: String,
    pub fields: Vec<Field>,
}

impl Default for BibEntry {
    fn default() -> BibEntry {
        let empty_vec: Vec<Field> = Vec::new();
        BibEntry {
            entry_type: "".to_string(),
            name: "".to_string(),
            fields: empty_vec,
        }
    }
}

impl BibEntry {
    pub fn to_object<'a>(&self, cx: &mut FunctionContext<'a>) -> JsResult<'a, JsObject> {
        let obj = cx.empty_object();

        let entry_type = cx.string(self.entry_type.clone());
        obj.set(cx, "entryType", entry_type)?;

        let name = cx.string(self.name.clone());
        obj.set(cx, "name", name)?;

        let fields = JsArray::new(cx, self.fields.len() as u32);
        for (i, field) in self.fields.iter().enumerate() {
            let field_obj = field.to_object(cx)?;
            fields.set(cx, i as u32, field_obj)?;
        }

        obj.set(cx, "fields", fields)?;

        Ok(obj)
    }
}