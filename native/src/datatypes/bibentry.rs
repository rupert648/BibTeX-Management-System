pub use crate::datatypes::field::Field;

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