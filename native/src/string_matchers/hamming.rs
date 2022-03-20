
/// Implementation of hamming distance that takes into account different length strings
pub fn compute(str1: &str, str2: &str) -> i32 {
    let shorter;
    let longer;

    if str1.len() < str2.len() {
        shorter = str1;
        longer = str2;
    } else {
        shorter = str2;
        longer = str1;
    }

    let mut count = (longer.len()-shorter.len()) as i32;

    for (i, shorter_char) in shorter.chars().enumerate() {
        let longer_char = longer.chars().nth(i).unwrap();

        if shorter_char != longer_char {
            count+=1;
        }
    }

    count
}