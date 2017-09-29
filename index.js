const fs = require('fs');
const path = require('path');
const LineByLineReader = require('line-by-line');

let pathToLogs = './';
const indxParam = process.argv.indexOf('-path');
if (indxParam !== -1) {
  pathToLogs = process.argv[indxParam + 1];
}

let pattern;
const indxPattern = process.argv.indexOf('-pattern');
if (indxPattern !== -1) {
  pattern = process.argv[indxPattern + 1];
}

if (!pattern) {
  return console.log('Need to pass a pattern');
}

function includesPattern(str) {
  let result = true;
  pattern.split(' ').forEach((word) => {
    if (!str.includes(word)) {
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

      if (includesPattern(line)) {
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

