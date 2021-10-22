use std::i32;
use std::cmp::min;

/// Computes the damerau levenshtein distance between two strings
pub fn compute(str1: &str, str2: &str) -> i32 {
    let str1_len = str1.len();
    let str2_len = str2.len();

    // 256 is the size of the alphabet - we are assuming extended ASCII for now
    // TODO: checks on size of alphabet used

    if str1_len == 0 {
        return str2_len as i32;
    }
    if str2_len == 0 {
        return str1_len as i32;
    }
    let mut dist = vec![vec![0; str1_len + 1]; str2_len + 1];

    let max_dist = str1_len + str2_len;
    dist[0][0] = max_dist as i32;

    for i in 0..str1_len+1 {
        dist[i][0] = i as i32;
    }
    for j in 0..str2_len+1 {
        dist[0][j] = j as i32;
    }

    for i in 1..str1_len+1 {
        for j in 1..str2_len+1 {
            // get chars
            let str1_char = str1.chars().nth(i-1).unwrap();
            let str2_char = str2.chars().nth(j-1).unwrap();

            let cost = if str1_char == str2_char {0} else {1};
            dist[i][j] = min_of_3(
                dist[i - 1][j] + 1,
                dist[i][j - 1] + 1,
                dist[i - 1][j - 1] + cost
            );

            // this bit allows swapping
            if  i > 1 &&
                j > 1 &&
                str1_char == str2.chars().nth(j-2).unwrap() && 
                str1.chars().nth(i-2).unwrap() == str2_char 
                {
                    dist[i][j] = min(dist[i][j], dist[i - 2][j - 2] + cost);
                }
        }
    }

    dist[str1_len][str2_len]
}


fn min_of_3(x: i32, y: i32, z: i32) -> i32 {
    if x <= y && x <= z {
        return x;
    }
    if y <= x && y <= z {
        return y;
    }

    return z;
}
