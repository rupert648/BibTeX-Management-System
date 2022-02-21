pub use crate::datatypes::field::Field;
use neon::prelude::*;

#[derive(Debug, Clone)]
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

impl PartialEq for BibEntry {
    fn eq(&self, other: &Self) -> bool {

        if self.fields.len() != other.fields.len() {
            return false;
        }

        let mut is_fields_same = true;
        for i in 0..self.fields.len() {
            let self_field = self.fields.get(i).unwrap();
            let other_field = other.fields.get(i).unwrap();
            if !self_field.is_exact_same(other_field) {
                is_fields_same = false;
                break;
            }
        }

        is_fields_same &&
        self.entry_type == other.entry_type &&
        self.name == other.name
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

    pub fn to_string(&self) -> String {
        let mut bib = String::new();

        bib.push('@');
        bib.push_str(&self.entry_type);
        bib.push('{');
            bib.push_str(&self.name);
            bib.push(',');
            for field in &self.fields {
                bib.push_str(&field.field_name);
                bib.push('=');
                bib.push('{');
                bib.push_str(&field.field_value);
                bib.push('}');
                bib.push(',');
            }
        bib.push('}');

        bib
    }

    pub fn get_field(&self, field_name: &str) -> String {
        let field_item = self.fields.iter().find(|&field| field.field_name.to_lowercase() == field_name);

        let unwrapped_val = match field_item {
            Some(entry) => entry.to_owned().field_value,
            None => String::from(""),
        };

        unwrapped_val
    }
}