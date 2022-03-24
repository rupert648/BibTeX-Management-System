const data = require('./data/testStrings.json');
const x = require('./native');
const fs = require('fs');
const now = require('performance-now');

const authorOutputFile = "./data/algComparisonAuthors.csv"
const titleOutputFile = "./data/algComparisonTitle.csv"

// append headings
fs.appendFileSync(authorOutputFile, "group,str1,str2,algorithm,score,timeTaken\n");
fs.appendFileSync(titleOutputFile, "group,str1,str2,algorithm,score,timeTaken\n");

const testAlg = (outputFile, group, algorithm, str1, str2) => {
    let start = now();
    let result;
    if (algorithm === 'ngram') result = x[algorithm](str1, str2, 2);
    else result = x[algorithm](str1, str2);
    let end = now();

    fs.appendFileSync(outputFile, `${group},\"${str1}\",\"${str2}\",${algorithm},${result},${end-start}\n`)
}

// test author strings
data.testAuthorStrings.map((group) => {
    const strings = group.values;

    const toCompare = strings[0];

    for (let i = 1; i < strings.length; i++) {
        testAlg(authorOutputFile, group.group, 'wagnerFischer', toCompare, strings[i]);
        testAlg(authorOutputFile, group.group, 'jaroWinkler', toCompare, strings[i]);
        testAlg(authorOutputFile, group.group, 'ngram', toCompare, strings[i]);
        testAlg(authorOutputFile, group.group, 'jensonshannonVector', toCompare, strings[i]);
    }
});

// test author strings
data.testTitleStrings.map((group) => {
    const strings = group.values;

    const toCompare = strings[0];

    for (let i = 1; i < strings.length; i++) {
        testAlg(titleOutputFile, group.group, 'wagnerFischer', toCompare, strings[i]);
        testAlg(titleOutputFile, group.group, 'jaroWinkler', toCompare, strings[i]);
        testAlg(titleOutputFile, group.group, 'ngram', toCompare, strings[i]);
        testAlg(titleOutputFile, group.group, 'jensonshannonVector', toCompare, strings[i]);
    }
});



