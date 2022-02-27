use neon::prelude::*;

pub fn clean_bibtex(bibtex_string: String) -> NeonResult<String> {
    let lines = bibtex_string.split("\n");

    // remove non-ascii characters
    // important for efficiency of jenson alg
    let lines_cleaned = lines.map(|x| x.replace(|c: char| !c.is_ascii(), ""));

    let mut lines_vec: Vec<String> = lines_cleaned.collect();
    
    // retains only non comments and non-empty lines
    lines_vec.retain(|line| 
        !line.is_empty() && 
        !is_comment(&line)
    );

    Ok(lines_vec.join("\n"))
}

// luckily for us a comment in bibtex must be a whole line
fn is_comment(line: &str) -> bool {
    let trimmed = line.trim();
    let first_char = trimmed.chars().next().unwrap();

    first_char == '%'
}

pub fn is_properly_formatted(entry: &str) -> bool {
    // TODO: Merge below functions so only one pass is done - less clean but faster?
    is_equal_curly_brackets(entry) &&
    is_equal_quotations(entry)
}

fn is_equal_curly_brackets(entry: &str) -> bool {
    let mut numb_bracks = 0;
    let mut escaped_char = false;
    for c in entry.chars() {
        if c == '\\' {
            escaped_char = true;
        } else if c == '{'  && !escaped_char{
            numb_bracks += 1;   
        } else if c == '}'  && !escaped_char{
            numb_bracks -= 1;
        } else {
            escaped_char = false;
        }
    }

    numb_bracks == 0
}

fn is_equal_quotations(entry: &str) -> bool {
    let mut numb_quotes = 0;
    let mut escaped_char = false;
    for c in entry.chars() {
        if c == '\\' {
            escaped_char = true;
        } else if c == '"' && !escaped_char {
            numb_quotes += 1;
        } else {
            escaped_char = false;
        }
    }

    numb_quotes % 2 == 0
}