const { Server } = require("socket.io");
const log = require('../utils/log');
const { getCards } = require('../database/database');

let io = null;
let games = {
    'testGame': {
        id: 1,
        name: "Chud",
        playerCount: 4,
        capacity: 16
    }
};

let users = [];

async function createGame(socket, game) {
    if(!socket.username) {
        return;
    }
    if(games[game.name] !== undefined) {
        return;
    }

    game.playerCount = 0;
    games[game.name] = game;

    socket.emit('game-created', game);
    game.cards = await getCards(game.useBaseGame, game.useExpansion, game.useNSFW);
}

function initialize(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    
    io.on('connection', (socket) => {
        socket.username = '';
        users.push(socket);
        log(`Client connected: ${socket.handshake.address}`);

        socket.on('get-games', () => {
            let gameArr = [];
            let index = 0;
            for (const [key, value] of Object.entries(games)) {
                gameArr.push({
                    id: index++,
                    name: value.name,
                    playerCount: value.playerCount,
                    capacity: value.capacity,
                    hasPassword: !!value.password
                });
            }
            socket.emit('get-games', gameArr);
        });

        socket.on('set-username', (username) => {
            log(`Setting username: ${username}`);
            socket.username = username;
        });

        socket.on('create-game', async (game) => {
            await createGame(socket, game);
        });

        socket.on('disconnect', () => {
            users = users.splice(users.indexOf(socket), 1);
            log(`Client disconnected: ${socket.handshake.address}`);
        });
    });
}

module.exports = {
    initialize: initialize
}