const moment = require('moment');
const fs = require('fs');
const logFile = './log.txt';

function log(text) {
    let datedText = `${moment().format('l LTS')} ${text}`;
    console.log(datedText);

    try {
        fs.appendFileSync(logFile, `${datedText}\r\n`);
    } catch(e) {
        console.error(e);
    }
    
}

module.exports = log;