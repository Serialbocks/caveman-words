const { Server } = require("socket.io");
const log = require('../utils/log');
const { getCards, updateTimesSeen } = require('../database/database');
const moment = require('moment');

let io = null;
let games = {};

let users = [];

function getPlayersInGame(game) {
    var players = {};

    for (const [key, value] of Object.entries(game.spectating)) {
        players[key] = value;
    }
    for (const [key, value] of Object.entries(game.teamMad)) {
        players[key] = value;
    }
    for (const [key, value] of Object.entries(game.teamGlad)) {
        players[key] = value;
    }

    return players;
}

function resolveCurrentTurn(game) {
    if(game.currentTurn) {
        let now = moment().valueOf();
        console.log(now);
        game.currentTurn.elapsed = now - game.currentTurn.started;
        console.log(game.currentTurn.elapsed);
        console.log(game.turnTime * 1000);
        if(game.currentTurn.elapsed >= (game.turnTime * 1000)) {
            game.pastTurns.push(game.currentTurn);
            game.currentTurn = null;
        }
    }
}

function getGameState(gameName) {
    var game = games[gameName];
    if(!game) return null;

    // Check if current turn is over
    resolveCurrentTurn(game);

    let gameState = {
        id: game.id,
        name: game.name,
        spectating: [],
        teamMad: [],
        teamGlad: [],
        currentTurn: game.currentTurn,
        pastTurns: game.pastTurns
    };

    for (const [key, value] of Object.entries(game.spectating)) {
        gameState.spectating.push(key);
    }
    for (const [key, value] of Object.entries(game.teamMad)) {
        gameState.teamMad.push(key);
    }
    for (const [key, value] of Object.entries(game.teamGlad)) {
        gameState.teamGlad.push(key);
    }

    return gameState;
}

function notifyPlayersInGame(gameName) {
    var game = games[gameName];
    if(!game) return;
    var gameState = getGameState(gameName);
    if(!gameState) return;

    for (const [key, value] of Object.entries(game.spectating)) {
        value.emit('sync-game-state', gameState);
    }
    for (const [key, value] of Object.entries(game.teamMad)) {
        value.emit('sync-game-state', gameState);
    }
    for (const [key, value] of Object.entries(game.teamGlad)) {
        value.emit('sync-game-state', gameState);
    }
}

function joinGame(socket, gameName, password) {
    var game = games[gameName];
    if(!game) return;

    if(game.password && password != game.password) {
        socket.emit('wrong-password');
        return;
    }

    game.spectating[socket.username] = socket;
    socket.game = game;
    socket.team = 'spectating';
    notifyPlayersInGame(gameName);
}

async function createGame(socket, game) {
    if(!socket.username) {
        return;
    }
    if(games[game.name] !== undefined) {
        return;
    }

    shuffle = (array) => {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    game.playerCount = 0;
    game.teamGlad = {};
    game.teamMad = {};
    game.spectating = {};
    games[game.name] = game;
    game.pastTurns = [];
    game.cards = await getCards(game.useBaseGame, game.useExpansion, game.useNSFW);
    game.cards = shuffle(game.cards);

    socket.emit('game-created', getGameState(game.name));
}

async function drawCard(socket) {
    game = socket.game;
    if(!game) return;

    let players = getPlayersInGame(game);

    timesSeen = (word) => {
        let times = 0;
        for (const [key, value] of Object.entries(players)) {
            var username = key;
            var ip = value.handshake.address;
            if(word.times_seen[username])
            {
                times += word.times_seen[username];
            }
            if(word.times_seen[ip])
            {
                times += word.times_seen[ip];
            }
        }
        return times;
    };

    compare = ( a, b ) => {
        if ( timesSeen(a) < timesSeen(b) ){
            return -1;
        }
        if ( timesSeen(a) > timesSeen(b) ){
            return 1;
        }
        return 0;
    };

    game.cards.sort(compare);

    socket.emit('draw-card', game.cards[0]);

    for (const [key, value] of Object.entries(players)) {
        var username = key;
        var ip = value.handshake.address;
        let word = game.cards[0];
        if(!word.times_seen[username])
        {
            word.times_seen[username] = 0;
        }
        if(!word.times_seen[ip])
        {
            word.times_seen[ip] = 0;
        }
        word.times_seen[username]++;
        word.times_seen[ip]++;
    }
    await updateTimesSeen(game.cards[0], players);
}

function takeTurn(socket) {
    let game = socket.game;
    let username = socket.username;
    if(!game || !username) return;

    resolveCurrentTurn(game);

    if(game.currentTurn) return;

    game.currentTurn = {
        player: username,
        currentCard: drawCard(socket),
        three: [],
        one: [],
        minusOne: [],
        skipped: [],
        started: moment().valueOf()
    }

    notifyPlayersInGame(socket.game.name);
    socket.emit('draw-card', game.currentTurn.currentCard);
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
            log(`User ${socket.username} creating game ${game.name}`);
            await createGame(socket, game);
        });

        socket.on('join-game', (gameName, password) => {
            log(`User ${socket.username} joining game ${gameName}`);
            joinGame(socket, gameName, password);
        });

        socket.on('take-turn', () => {
            log(`User ${socket.username} taking turn`);
            takeTurn(socket);
        });

        socket.on('draw-card', () => {
            log(`User ${socket.username} requested new card`);
            drawCard(socket);
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