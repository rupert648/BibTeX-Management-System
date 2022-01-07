use core::panic;
use std::collections::BTreeMap;

// data structures
struct SparseProbabilityArray {
    card_map: BTreeMap<i32, i32>,
    acc: i32,
    final_probs: Vec<f64>,
    final_events: Vec<i32>
}

struct JS {
    char_val_upb: i32,
}

fn build_js(max_char_val: i32) -> JS {
    JS { char_val_upb: (max_char_val + 1) }
}

fn build_empty_sparse_probability_array() -> SparseProbabilityArray {
    SparseProbabilityArray {
        card_map: BTreeMap::new(),
        acc: 0,
        final_probs: Vec::new(),
        final_events: Vec::new(),
    }
}

fn spa_add_event(event: i32, card: i32, spa_instance: &mut SparseProbabilityArray ) {
    if !spa_instance.card_map.contains_key(&event) {
        spa_instance.card_map.insert(event.clone(), 0);
    }

    spa_instance.card_map.insert(event.clone(), spa_instance.card_map.get(&event).unwrap() + card);
    spa_instance.acc += card;
}

fn spa_finalise(spa_instance: &mut SparseProbabilityArray) {

    let mut pointer = 0;
    for (event, value) in &spa_instance.card_map {
        let calc = (value.clone() as f64) / (spa_instance.acc as f64);

        spa_instance.final_events.insert(pointer, event.clone());
        spa_instance.final_probs.insert(pointer, calc);

        pointer += 1;
    }

    // reset tree
    spa_instance.card_map = BTreeMap::new();
}

fn string_to_sparse_array(s: &str, js_instance: &JS) -> SparseProbabilityArray {

    let mut spa = build_empty_sparse_probability_array();

    let mut ch1: char = '\0';
    let mut ch2: char = s.chars().nth(0).unwrap();
    spa_add_event((ch1 as i32) * js_instance.char_val_upb + (ch2 as i32), 1, &mut spa);

    for i in 0..(s.len() as i32) {
        ch1 = s.chars().nth(i as usize).unwrap();
        spa_add_event(ch1 as i32, 2, &mut spa);
        // spa.addEvent(ch1, 2)
        if (ch1 as i32) > js_instance.char_val_upb || ch1 == '\0' {
            // ahhhh
            panic!();
        }

        if i == (s.len() - 1) as i32 {
            // if ch2 (i + 1) is out of bounds
            ch2 = '\0';
        } else {
            ch2 = s.chars().nth((i as usize)+1).unwrap();
        }

        spa_add_event((ch1 as i32) * js_instance.char_val_upb + (ch2 as i32), 1, &mut spa);
    }

    spa_finalise(&mut spa);

    spa
}

fn h(d: &f64) -> f64 {
    -d * d.ln()
}

fn h_calc(d1: &f64, d2: &f64) -> f64 {
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
    let mut ar1_ptr: usize = 0;
    let mut ar2_ptr: usize = 0;
    let mut ar1_event = ar1.final_events[ar1_ptr];
    let mut ar2_event = ar1.final_events[ar2_ptr];
    
    let mut finished = false;
    let mut sim_acc = 0.0;

    while !finished {
        if ar1_event == ar2_event {
            sim_acc += h_calc(&ar1.final_probs[ar1_ptr], &ar2.final_probs[ar2_ptr]);
            ar1_ptr += 1;
            ar2_ptr += 1;
        } else if ar1_event < ar2_event {
            ar1_ptr += 1;
        } else {
            ar2_ptr += 1;
        }

        if ar1_ptr == ar1.final_events.len() {
            ar1_event = i32::MAX;
        } else {
            ar1_event = ar1.final_events[ar1_ptr];
        }

        if ar2_ptr == ar2.final_events.len() {
            ar2_event = i32::MAX;
        } else {
            ar2_event = ar2.final_events[ar2_ptr];
        }

        finished = 
            (ar1_ptr == ar1.final_events.len())
            &&
            (ar2_ptr == ar2.final_events.len());
    }

    let ln_of_2: f64 = (2.0 as f64).ln();
    let k: f64 = f64_max(0.0, 1.0 - (sim_acc / ln_of_2) / 2.0);

    k.sqrt()
}
 
pub fn compute(str1: &str, str2: &str) -> f64 {
    let sed = build_js(255);
    let s1 = string_to_sparse_array(str1, &sed);
    let s2 = string_to_sparse_array(str2, &sed);

    distance(s1, s2)
}