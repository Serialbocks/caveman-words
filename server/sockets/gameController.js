const { Server } = require("socket.io");
const log = require('../utils/log');

let io = null;
let games = {
    'testGame': {
        id: 1,
        name: "Chud",
        playerCount: 4,
        capacity: 16
    }
};

function initialize(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    
    io.on('connection', (socket) => {
        log(`Client connected: ${socket.handshake.address}`);

        socket.on('get-games', () => {
            var gameArr = [];
            for (const [key, value] of Object.entries(games)) {
                gameArr.push(value);
            }
            socket.emit('get-games', gameArr);
        });

        socket.on('disconnect', () => {
            log(`Client disconnected: ${socket.handshake.address}`);
        });
    });
}

module.exports = {
    initialize: initialize
}