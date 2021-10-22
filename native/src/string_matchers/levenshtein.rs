
pub fn compute(str1: &str, str2: &str) -> i32 {
    let m = str1.len();
    let n = str2.len();

    leven_recursive(str1, str2, m, n)
}

fn leven_recursive(str1: &str, str2: &str, m: usize, n: usize) -> i32 {
    if m == 0 {
        return n as i32;
    }

    if n == 0 {
        return m as i32;
    }

    let str1_char = str1.chars().nth(m-1);
    let str2_char = str1.chars().nth(n-1);
    // If last chars are the same, recurse on remainder of string
    if str1_char == str2_char {
        return leven_recursive(str1, str2, m - 1, n - 1) as i32;
    }

    // try 3 operations: insert, remove and replace
    return 1 + min_of_3(
        leven_recursive(str1, str2, m, n - 1),  // insert
        leven_recursive(str1, str2, m - 1, n),  // remove
        leven_recursive(str1, str2, m - 1, n - 1),  // replace
    ) as i32;
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