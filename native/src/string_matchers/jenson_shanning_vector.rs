use std::collections::{HashMap, BTreeMap};
use std::num::sqrt;

// data structures
struct SparseProbabilityArray {
    cardMap: BTreeMap<i32, i32>,
    acc: i32,
    finalProbs: Vec<f64>,
    finalEvents: Vec<i32>
}

struct JS {
    charValUpb: i32,
    memoTable: HashMap<String, SparseProbabilityArray>,
}

fn build_js(maxCharVal: i32) -> JS {
    JS { charValUpb: (maxCharVal + 1), memoTable: HashMap::new() }
}

fn stringToSparseArray(s: &str, js_instance: &JS) -> SparseProbabilityArray {
    if js_instance.memoTable.contains_key(s) {
        return js_instance.memoTable.get(s);
    }

    
}

pub fn compute(str1: &str, str2: &str) -> f64 {
    let sed = build_js(255);
    let s1 = stringToSparseArray(str1, &sed);
    let s2 = stringToSparseArray(str2, &sed);

    distance(s1, s2);
}