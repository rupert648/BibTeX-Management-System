use array2d::Array2D;
use std::cmp;

pub fn compute(str1: &str, str2: &str) -> i32 {
    // 2d array
    let mut d = Array2D::filled_with(0 as i32, str1.len()+1, str2.len()+1);

    for i in 1..str1.len()+1 {
        d[(i, 0)] = i as i32;
    }

    for j in 1..str2.len()+1 {
        d[(0, j)] = j as i32;
    }

    for j in 1..str2.len()+1 {
        for i in 1..str1.len()+1 {
            let c_1 = str1.chars().nth(i-1).unwrap();
            let c_2 = str2.chars().nth(j-1).unwrap();

            let mut substitution_cost = 1;
            if c_1 == c_2 {
                substitution_cost = 0;
            } 

            d[(i, j)] = cmp::min(
                cmp::min(d[(i-1, j)] + 1, d[(i, j-1)] + 1),
                d[(i-1, j-1)] + substitution_cost
            );
        }
    }

    d[(str1.len(), str2.len())]
}