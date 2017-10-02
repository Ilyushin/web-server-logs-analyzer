const fs = require('fs');
const path = require('path');
const LineByLineReader = require('line-by-line');

let pathToLogs = './';
let indx = process.argv.indexOf('-path');
if (indx !== -1) {
  pathToLogs = process.argv[indx + 1];
}

let includePattern;
indx = process.argv.indexOf('-include');
if (indx !== -1) {
  includePattern = process.argv[indx + 1];
}

if (!includePattern) {
  return console.log('Need to pass a pattern');
}

let excludePattern;
indx = process.argv.indexOf('-exclude');
if (indx !== -1) {
  excludePattern = process.argv[indx + 1];
}

if (!includePattern) {
  return console.log('Need to pass a pattern');
}

function checkPatterns(str) {
  let result = true;
  includePattern.split(' ').forEach((word) => {
    if (!str.includes(word)) {
      result = false;
    }
  });

  excludePattern.split(' ').forEach((word) => {
    if (str.includes(word)) {
      result = false;
    }
  });

  return result;
}

const result = [];
function getReadFile(pathLog) {
  return new Promise((resolve, reject) => {
    const lr = new LineByLineReader(pathLog);

    lr.on('error', err => reject(`Error in ${pathLog}: ${err}`));

    lr.on('line', (line) => {
      lr.pause();

      if (checkPatterns(line)) {
        console.log(line);
        result.push(1);
      }
      setTimeout(() => {
        lr.resume();
      }, 5);
    });

    lr.on('end', () => resolve(true));
  });
}

if (fs.existsSync(pathToLogs)) {
  if (fs.statSync(pathToLogs).isDirectory()) {
    const logs = fs.readdirSync(pathToLogs);
    if (logs.length) {
      const promises = [];
      logs.forEach((fileName) => {
        promises.push(getReadFile(path.join(pathToLogs, fileName)));
      });
      Promise.all(promises)
        .then(() => {
          console.log(result.length);
        });
    }
  } else {
    console.log('Passed a path is not a directory.');
  }
} else {
  console.log('Passed a bad path.');
}

