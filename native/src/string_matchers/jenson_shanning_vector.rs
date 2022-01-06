use core::panic;
use std::collections::{HashMap, BTreeMap};

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

fn build_empty_sparse_probability_array() -> SparseProbabilityArray {
    SparseProbabilityArray {
        cardMap: BTreeMap::new(),
        acc: 0,
        finalProbs: Vec::new(),
        finalEvents: Vec::new(),
    }
}

fn spa_add_event(event: i32, card: i32, spa_instance: &mut SparseProbabilityArray ) {
    if spa_instance.cardMap.contains_key(&event) {
        spa_instance.cardMap.insert(event.clone(), 0);
    }

    spa_instance.cardMap.insert(event.clone(), spa_instance.cardMap.get(&event).unwrap() + card);
    spa_instance.acc = spa_instance.acc + card;
}

fn spa_finalise(spa_instance: &mut SparseProbabilityArray) {

    let mut pointer = 0;
    for (event, value) in &spa_instance.cardMap {
        let calc = (value.clone() as f64) / (spa_instance.acc as f64);

        spa_instance.finalEvents.insert(pointer, event.clone());
        spa_instance.finalProbs.insert(pointer, calc);

        pointer += 1;
    }

    // reset tree
    spa_instance.cardMap = BTreeMap::new();
}

fn string_to_sparse_array(s: &str, js_instance: &JS) -> SparseProbabilityArray {

    let mut spa = build_empty_sparse_probability_array();

    let mut ch1: char = '\0';
    let mut ch2: char = s.chars().nth(0).unwrap();
    spa_add_event((ch1 as i32) * js_instance.charValUpb + (ch2 as i32), 1, &mut spa);

    for i in 0..(s.len() as i32) {
        // once end reached
        if i == (s.len() - 1) as i32 {
            ch2 = '\0';
            spa_add_event((ch1 as i32) * js_instance.charValUpb + (ch2 as i32), 1, &mut spa);
            continue;
        }

        // main loop body
        ch1 = s.chars().nth(i as usize).unwrap();
        spa_add_event(ch1 as i32, 2, &mut spa);
        // spa.addEvent(ch1, 2)
        if (ch1 as i32) > js_instance.charValUpb || ch1 == '\0' {
            // ahhhh
            panic!();
        }

        ch2 = s.chars().nth((i as usize)+1).unwrap();

        spa_add_event((ch1 as i32) * js_instance.charValUpb + (ch2 as i32), 1, &mut spa);
    }

    spa_finalise(&mut spa);

    spa
}

fn h(d: &f64) -> f64 {
    -d * d.ln()
}

fn hCalc(d1: &f64, d2: &f64) -> f64 {
    let intermediate = d1 + d2;
    h(d1) + h(d2) - h(&intermediate)
}

fn f64_max(d1: f64, d2: f64) -> f64 {
    if d2 > d1 {
        return d2
    }

    d1
}

fn distance(ar1: SparseProbabilityArray, ar2: SparseProbabilityArray) -> f64 {
    let mut ar1Ptr: usize = 0;
    let mut ar2Ptr: usize = 0;
    let mut ar1Event = ar1.finalEvents[ar1Ptr];
    let mut ar2Event = ar1.finalEvents[ar2Ptr];
    
    let mut finished = false;
    let mut simAcc = 0.0;

    while !finished {
        if ar1Event == ar2Event {
            simAcc += hCalc(&ar1.finalProbs[ar1Ptr], &ar2.finalProbs[ar2Ptr]);
            ar1Ptr += 1;
            ar2Ptr += 1;
        } else if ar1Event < ar2Event {
            ar1Ptr += 1;
        } else {
            ar2Ptr += 1;
        }

        if ar1Ptr == ar1.finalEvents.len() {
            ar1Event = i32::MAX;
        } else {
            ar1Event = ar1.finalEvents[ar1Ptr];
        }

        if ar2Ptr == ar2.finalEvents.len() {
            ar2Event = i32::MAX;
        } else {
            ar2Event = ar2.finalEvents[ar2Ptr];
        }

        finished = 
            ar1Ptr == ar1.finalEvents.len() &&
            ar2Ptr == ar2.finalEvents.len();
    }

    let two_f64: f64 = 2.0;
    let k: f64 = f64_max(0.0, 1.0 - (simAcc / two_f64.ln()) / 2.0);

    k.sqrt()
}
 
pub fn compute(str1: &str, str2: &str) -> f64 {
    let sed = build_js(255);
    let s1 = string_to_sparse_array(str1, &sed);
    let s2 = string_to_sparse_array(str2, &sed);

    distance(s1, s2)
}