
use array2d::Array2D;
use std::cmp;

// dynamic programming method
pub fn compute(str1: &str, str2: &str) -> i32 {
    let p = str1.len();
    let q = str2.len();

    let mut table = Array2D::filled_with(0 as i32, p+1, q+1);

    for i in 0..p+1 {
        for j in 0..q+1 {

            if i == 0 || j == 0 {
                table[(i,j)] = 0;
            } else if str1.chars().nth(i-1).unwrap() == str2.chars().nth(j-1).unwrap() {
                table[(i,j)] = table[(i-1, j-1)] + 1;
            } else {
                table[(i,j)] = cmp::max(table[(i-1,j)], table[(i, j-1)]);
            }
        }
    }

    table[(p, q)]
}