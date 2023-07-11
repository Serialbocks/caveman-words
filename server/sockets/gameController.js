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
        game.currentTurn.elapsed = now - game.currentTurn.started;
        if(game.currentTurn.elapsed >= (game.turnTime * 1000)) {
            game.pastTurns.unshift(game.currentTurn);
            game.currentTurn = null;
        }
    }
}

function getPublicCurrentTurn(currentTurn) {
    if(!currentTurn) return currentTurn;

    var publicCurrentTurn = {
        player: currentTurn.player,
        three: currentTurn.three,
        one: currentTurn.one,
        minusOne: currentTurn.minusOne,
        skipped: currentTurn.skipped,
        started: currentTurn.started,
        elapsed: currentTurn.elapsed,
        team: currentTurn.team
    };

    return publicCurrentTurn;
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
        currentTurn: getPublicCurrentTurn(game.currentTurn),
        pastTurns: game.pastTurns,
        turnTime: game.turnTime
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
        if(gameState.currentTurn && gameState.currentTurn.team != "spectating") {
            gameState.currentCard = game.currentTurn.currentCard;
        } else {
            gameState.currentCard = undefined;
        }
        value.emit('sync-game-state', gameState);
    }
    for (const [key, value] of Object.entries(game.teamMad)) {
        if(gameState.currentTurn && gameState.currentTurn.team != "teamMad") {
            gameState.currentCard = game.currentTurn.currentCard;
        } else {
            gameState.currentCard = undefined;
        }
        value.emit('sync-game-state', gameState);
    }
    for (const [key, value] of Object.entries(game.teamGlad)) {
        if(gameState.currentTurn && gameState.currentTurn.team != "teamGlad") {
            gameState.currentCard = game.currentTurn.currentCard;
        } else {
            gameState.currentCard = undefined;
        }
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

    if(!game.connectedPlayers) {
        game.connectedPlayers = [];
    }

    game.connectedPlayers.unshift(socket);
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

async function drawCard(socket, previousCardScore) {
    game = socket.game;
    if(!game) return;

    resolveCurrentTurn(game);
    let currentTurn = game.currentTurn;
    if(!currentTurn) return;

    if(currentTurn.player != socket.username) return;

    let players = getPlayersInGame(game);

    if(currentTurn.currentCard) {
        switch(previousCardScore) {
            case 3:
                currentTurn.three.push(currentTurn.currentCard);
                break;
            case 1:
                currentTurn.one.push(currentTurn.currentCard);
                break;
            case 0:
                currentTurn.skipped.push(currentTurn.currentCard);
                break;
            case -1:
                currentTurn.minusOne.push(currentTurn.currentCard);
                break;
            default:
                break;
        }
    }

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

    currentTurn.currentCard = game.cards[0];
    socket.emit('draw-card', game.cards[0]);
    notifyPlayersInGame(game.name);

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

async function takeTurn(socket) {
    let game = socket.game;
    let username = socket.username;
    if(!game || !username) return;

    resolveCurrentTurn(game);

    if(game.currentTurn) return;

    game.currentTurn = {
        player: username,
        currentCard: null,
        three: [],
        one: [],
        minusOne: [],
        skipped: [],
        started: moment().valueOf(),
        team: socket.team
    }

    await drawCard(socket, 0);
}

function joinTeam(socket, teamName) {
    let game = socket.game;
    if(!game) return;

    switch(teamName) {
        case 'teamMad':
            game.teamMad[socket.username] = socket;
            delete game.spectating[socket.username];
            delete game.teamGlad[socket.username];
            break;
        case 'teamGlad':
            game.teamGlad[socket.username] = socket;
            delete game.spectating[socket.username];
            delete game.teamMad[socket.username];
            break;
        default:
            return;
    }

    socket.team = teamName;

    notifyPlayersInGame(game.name);
}

function endTurn(socket) {
    let game = socket.game;
    if(!game) return;
    let currentTurn = game.currentTurn;
    if(!currentTurn || currentTurn.player != socket.username) return;

    game.currentTurn.started = 0;
    resolveCurrentTurn(game);
    notifyPlayersInGame(game.name);
}

function onDisconnect(socket) {
    users = users.splice(users.indexOf(socket), 1);

    let game = socket.game;
    if(game) {
        let index = game.connectedPlayers?.indexOf(socket);
        if(index >= 0) {
            game.connectedPlayers.splice(index, 1);
            if(!game.connectedPlayers.length) {
                delete games[game.name];
            }
        }
    }
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
                gameArr.unshift({
                    id: index++,
                    name: value.name,
                    playerCount: value.connectedPlayers.length,
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

        socket.on('take-turn', async () => {
            log(`User ${socket.username} taking turn`);
            await takeTurn(socket);
        });

        socket.on('draw-card', (previousCardScore) => {
            log(`User ${socket.username} requested new card`);
            drawCard(socket, previousCardScore);
        });

        socket.on('join-team', (teamName) => {
            log(`User ${socket.username} joining team ${teamName}`);
            joinTeam(socket, teamName);
        });

        socket.on('get-game-state', () => {
            log(`User ${socket.username} requested game state`);
            notifyPlayersInGame(socket.game.name);
        });

        socket.on('end-turn', () => {
            log(`User ${socket.username} requested end turn`);
            endTurn(socket);
        });

        socket.on('disconnect', () => {
            log(`Client disconnected: ${socket.handshake.address}`);
            onDisconnect(socket);
        });
    });
}

module.exports = {
    initialize: initialize
}