const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: String,
    scores: [Number],
    total: Number
});

const GameSchema = new mongoose.Schema({
    players: [PlayerSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Game', GameSchema);
