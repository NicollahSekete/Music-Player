const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get posts
router.get('/', (req, res) =>{
    res.send('hello')
});

// Add Post

module.exports = router;