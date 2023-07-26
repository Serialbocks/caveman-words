const log = require('../utils/log');
const { parseFile } = require('@fast-csv/parse');
const { cardSet, card } = require('./card-set');
const Low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');

let db = null;
let cardSets = null;

const file = './db.json';
const adapter = new FileSync(file);
const defaultData = {cardSets: []};

async function connect() {
    db = Low(adapter);
    await db.defaults(defaultData).write();
    cardSets = db.get('cardSets').value();
}

async function updateTimesSeen(card, players) {
    var cardSet = db.get('cardSets')
        .find({ name: card.set })
        .value();

    let word = cardSet.cards[card.index];
    for (const [key, value] of Object.entries(players)) {
        var username = key;
        var ip = value.handshake.address;
        if(value.handshake.headers && value.handshake.headers['x-forwarded-for']) {
            ip = value.handshake.headers['x-forwarded-for'];
        }
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

    db.write();
}

async function getCards(useBaseGame, useExpansion, useNSFW) {
    var cards = [];

    if(useBaseGame) {
        var baseGame = db.get('cardSets')
            .find({ name: 'Base Game' })
            .value();

        if(!baseGame) {
            log(`Error: base game set not found in DB!`);
            return;
        }
        cards = cards.concat(baseGame.cards);
    }

    if(useExpansion) {
        var expansion = db.get('cardSets')
            .find({ name: 'Expansion' })
            .value();

        if(!expansion) {
            log(`Error: expansion set not found in DB!`);
            return;
        }
        cards = cards.concat(expansion.cards);
    }

    if(useNSFW) {
        var nsfw = db.get('cardSets')
            .find({ name: 'nsfw' })
            .value();

        if(!nsfw) {
            log(`Error: nsfw set not found in DB!`);
            return;
        }
        cards = cards.concat(nsfw.cards);
    }

    return cards;
}

async function seedCards() {
    if(db == null) {
        await connect();
    }

    log('Seeding cards...');

    log('Seeding base game...');
    var baseGame = cardSet();
    baseGame.name = 'Base Game';
    parseFile('./assets/base-game.csv')
        .on('error', error => log(error))
        .on('data', row => {
            var newCard = card();
            newCard.index = baseGame.cards.length;
            newCard.word1 = row[0];
            newCard.word2 = row[1];
            newCard.set = baseGame.name;
            baseGame.cards.push(newCard);
        })
        .on('end', rowCount => {
            log(`Parsed ${rowCount} rows`);
            db.get('cardSets').push(baseGame).write();
            log(`Base game saved to DB`);
        });

        log('Seeding expansion...');
        var expansion = cardSet();
        expansion.name = 'Expansion';
        parseFile('./assets/expansion.csv')
            .on('error', error => log(error))
            .on('data', row => {
                var newCard = card();
                newCard.index = expansion.cards.length;
                newCard.word1 = row[0];
                newCard.word2 = row[1];
                newCard.set = expansion.name;
                expansion.cards.push(newCard);
            })
            .on('end', rowCount => {
                log(`Parsed ${rowCount} rows`);
                db.get('cardSets').push(expansion).write();
                log(`Expansion saved to DB`);
            });

            log('Seeding nsfw...');
            var nsfw = cardSet();
            nsfw.name = 'nsfw';
            parseFile('./assets/nsfw.csv')
                .on('error', error => log(error))
                .on('data', row => {
                    var newCard = card();
                    newCard.index = nsfw.cards.length;
                    newCard.word1 = row[0];
                    newCard.word2 = row[1];
                    newCard.set = nsfw.name;
                    nsfw.cards.push(newCard);
                })
                .on('end', rowCount => {
                    log(`Parsed ${rowCount} rows`);
                    db.get('cardSets').push(nsfw).write();
                    log(`nsfw saved to DB`);
                });
}

module.exports = {
    connect: connect,
    seedCards: seedCards,
    getCards: getCards,
    updateTimesSeen: updateTimesSeen
};