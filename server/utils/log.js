const moment = require('moment');
const fs = require('fs');
const logFile = './log.txt';

function log(text, socket) {
    let ipAddress = '';
    if(socket) {
        if(socket.handshake?.headers && socket.handshake.headers['x-forwarded-for']) {
            ipAddress = ' ' + socket.handshake.headers['x-forwarded-for'];
        } else {
            ipAddress = ' ' + socket.handshake.address;
        }
    }

    let datedText = `${moment().format('l LTS')}${ipAddress} ${text}`;
    console.log(datedText);

    try {
        fs.appendFileSync(logFile, `${datedText}\r\n`);
    } catch(e) {
        console.error(e);
    }
    
}

module.exports = log;