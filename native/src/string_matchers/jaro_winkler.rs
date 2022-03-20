use std::cmp;

pub fn compute(str1: &str, str2: &str) -> f64 {
    if str1 == "" || str2 == "" { return 0.0 }

    if str1 == str2 { return 1.0 }

    let mut prefix_match: i32 = 0;
    let mut matches: i32 = 0;
    let mut transpositions: i32 = 0;
    let max_length = cmp::max(str1.len(), str2.len());
    let max_match_distance = cmp::max(((max_length / 2) - 1) as i32, 0);

    let shorter: &str = if str1.len() < str2.len() { str1 } else { str2 };
    let longer: &str = if str1.len() < str2.len() { str2 } else { str1 };

    for i in 0..shorter.len() as i32 {
        let mut does_match: bool = shorter.chars().nth(i as usize).unwrap() == longer.chars().nth(i as usize).unwrap();

        if does_match {
            if i < 4 {
                prefix_match += 1;
            }

            matches += 1;
            continue;
        }

        // check for transposed matches
        let lower_val: i32 = cmp::max(i - max_match_distance, 0);
        let upper_val: i32 = cmp::min(i + max_match_distance, longer.len() as i32);
        for j in lower_val..upper_val {
            if i == j { continue; }

            // transposition required to match?
            does_match = shorter.chars().nth(i as usize).unwrap() == longer.chars().nth(i as usize).unwrap();
            if does_match {
                transpositions += 1;
                break;
            }
        }
    }

    if matches == 0 {
        return 0.0;
    }

    transpositions = transpositions / 2;

    let score: f64 = 0.334 * (
        ((matches as f64) / (longer.len() as f64))
        + ((matches as f64) / (shorter.len() as f64))
        + ((matches - transpositions) as f64 / (matches as f64))
    );

    if score < 0.7 { return score; }

    // we already have a good match, hence we boost the score proportional to the common prefix
    let boosted_score = score + (prefix_match as f64) * 0.1 * (1.0 - score);
    boosted_score
}