const card = () => {
    return {
        index: -1,
        word1: '',
        word2: '',
        set: '',
        reports: 0,
        times_seen: {}
    };
}

const cardSet = () => {
    return {
        name: '',
        cards: []
    };
}

module.exports = {
    card: card,
    cardSet: cardSet
}