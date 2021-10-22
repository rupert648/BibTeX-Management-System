
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
    let mut i = 0;

    while i < shorter.len() {
        let shorter_char = shorter.chars().nth(i).unwrap();
        let longer_char = longer.chars().nth(i).unwrap();

        if shorter_char != longer_char {
            count+=1;
        }

        i+=1;
    }

    count
}