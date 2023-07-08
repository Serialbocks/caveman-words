const MongoClient = require("mongodb").MongoClient;
const log = require('../utils/log');
const { parseFile } = require('@fast-csv/parse');
const { cardSet, card } = require('./card-set');

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

let db = null;
let cardSets = null;

async function connect() {
    db = client.db('caveman_words');
    cardSets = db.collection('card_sets');
}

async function getCards(useBaseGame, useExpansion, useNSFW) {
    var cards = [];

    if(useBaseGame) {
        var baseGame = await cardSets.findOne({
            name: 'Base Game'
        });

        if(!baseGame) {
            log(`Error: base game set not found in DB!`);
            return;
        }
        cards = cards.concat(baseGame.cards);
    }

    if(useExpansion) {
        var expansion = await cardSets.findOne({
            name: 'Expansion'
        });

        if(!expansion) {
            log(`Error: expansion set not found in DB!`);
            return;
        }
        cards = cards.concat(expansion.cards);
    }

    if(useNSFW) {
        var nsfw = await cardSets.findOne({
            name: 'nsfw'
        });

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
    parseFile('../assets/base-game.csv')
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
            cardSets.insertOne(baseGame);
            log(`Base game saved to DB`);
        });

        log('Seeding expansion...');
        var expansion = cardSet();
        expansion.name = 'Expansion';
        parseFile('../assets/expansion.csv')
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
                cardSets.insertOne(expansion);
                log(`Expansion saved to DB`);
            });

            log('Seeding nsfw...');
            var nsfw = cardSet();
            nsfw.name = 'nsfw';
            parseFile('../assets/nsfw.csv')
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
                    cardSets.insertOne(nsfw);
                    log(`nsfw saved to DB`);
                });
}

module.exports = {
    connect: connect,
    seedCards: seedCards,
    getCards: getCards
};