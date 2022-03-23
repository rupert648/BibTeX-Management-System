let x = require('./native');
const fs = require('fs');
let now = require('performance-now')

for (let i = 1000; i < 50000; i += 100) {
    // create two random strings of length 1,000,000
    let s1 = ""
    let s2 = ""
    let characters= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let j = 0; j < i; j++) {
        s1 += characters.charAt(Math.floor(Math.random() * characters.length));
        s2 += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    let start = now()
    x.jensonshannonVector(s1, s2);
    let end = now()
    
    let string = `${i},${end-start}\n`;

    fs.appendFileSync('./test.csv', string);
}