const { Server } = require("socket.io");
const log = require('../utils/log');

let io = null;
let games = {

};

function initialize(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(socket.handshake.address);
    });

    io.on('get-games', (socket) => {
        console.log(socket.address);
    });
}

module.exports = {
    initialize: initialize
}