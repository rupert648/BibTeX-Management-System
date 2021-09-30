#[derive(Debug)]
pub struct BibEntry {
    // our name
    reference_field: String,

    address: String,
    annote: String,
    author: String,
    booktitle: String,
    chapter: i32,
    crossref: String,
    edition: String,
    editor: String,
    howpublished: String,
    institution: String,
    journal: String,
    key: String,
    month: String,
    note: String,
    number: i32,
    organization: String,
    pages: String,
    publisher: String,
    school: String,
    series: String,
    title: String,
    type_name: String,
    volume: String,
    year: i32,
}

impl Default for BibEntry {
    fn default() -> BibEntry {
        BibEntry {
            reference_field: "".to_string(),
            address: "".to_string(),
            annote: "".to_string(),
            author: "".to_string(),
            booktitle: "".to_string(),
            chapter: 1,
            crossref: "".to_string(),
            edition: "".to_string(),
            editor: "".to_string(),
            howpublished: "".to_string(),
            institution: "".to_string(),
            journal: "".to_string(),
            key: "".to_string(),
            month: "".to_string(),
            note: "".to_string(),
            number: 1,
            organization: "".to_string(),
            pages: "".to_string(),
            publisher: "".to_string(),
            school: "".to_string(),
            series: "".to_string(),
            title: "".to_string(),
            type_name: "".to_string(),
            volume: "".to_string(),
            year: 1980,
        }
    }
}