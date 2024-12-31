const express = require('express');
const Game = require('../models/Game');
const router = express.Router();

// Save a new game
router.post('/', async (req, res) => {
    try {
        const newGame = new Game({
            players: req.body.players
        });
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all games
router.get('/', async (req, res) => {
    try {
        const games = await Game.find().sort({ createdAt: -1 });
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
