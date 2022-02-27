let x = require('./native');

let result = x.searchVolume('./test_dir');

for (let i = 0; i < result.length; i++) {
    console.log(result[i]);
    x.parseBibTexFile(result[i]);
}