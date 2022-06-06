const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();
require('dotenv').config()


const API_KEY = process.env.API_KEY

// Get all songs

router.get('/', async (req, res) => {
    const playlist = await loadPlaylistCollection();
    res.send(await playlist.find({}).toArray())
});

router.post('/', async (req, res) => {
    const playlist = await loadPlaylistCollection();
    await playlist.insertOne({
        playlistName: req.body.playlistName,
        playlistSongIDs: req.body.playlistSongIDs,
        createdAt: new Date()
        
    });
    res.status(201).send();
});

async function loadPlaylistCollection() {
    const client = await mongodb.MongoClient.connect(
        `mongodb+srv://nicollah:${API_KEY}@music-player.6j3xqsp.mongodb.net/?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
        }
    );

    return client.db('music-player').collection('playlist');
}



module.exports = router;