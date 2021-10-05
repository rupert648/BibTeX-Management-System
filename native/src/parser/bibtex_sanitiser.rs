use neon::prelude::*;

pub fn clean_bibtex(bibtex_string: String) -> NeonResult<String> {
    let lines = bibtex_string.split("\n");
    let mut lines_vec: Vec<&str> = lines.collect();
    
    // retains only non comments and non-empty lines
    lines_vec.retain(|&line| 
        !line.is_empty() && 
        !is_comment(line)
    );


    // return rejoin strings
    Ok(lines_vec.join("\n"))
}


// luckily for us a comment in bibtex must be a whole line
fn is_comment(line: &str) -> bool {
    let trimmed = line.trim();
    let first_char = trimmed.chars().next().unwrap();

    first_char == '%'
}

pub fn is_properly_formatted(entry: &str) -> bool {
    // TODO: Add more sanitisation checks
    is_equal_curly_brackets(entry) &&
    is_equal_quotations(entry)
}

fn is_equal_curly_brackets(entry: &str) -> bool {
    let numb_left = entry.matches("{").count();
    let numb_right = entry.matches("}").count();
    numb_left != 0 && (numb_left == numb_right)
}

fn is_equal_quotations(entry: &str) -> bool {
    // TODO: What if they use escape character 😧😧
    entry.matches("\"").count() % 2 == 0
}