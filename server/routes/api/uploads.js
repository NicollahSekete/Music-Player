const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const { constants } = require('fs');
require('dotenv').config()

const API_KEY = process.env.API_KEY

// // Mongo URI
const mongoURI = `mongodb+srv://nicollah:${API_KEY}@music-player.6j3xqsp.mongodb.net/?retryWrites=true&w=majority`;

// //  mongo connection
const conn = mongoose.createConnection(mongoURI);

// // Init gfs
let gfs;

conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
      })
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// //  storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        console.log(req)
       
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',

                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });


//@route POST
//not currently available for user to use, only used at the moment to add songs to database for get
router.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file,
   });
  
   res.status(201).send();
});



// @route GET /
router.get('/', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.send({ files: false })
        } else {
            files.map(file => {
                if (
                    file.contentType === 'audio/mpeg' ||
                    file.contentType === 'image/png'
                ) {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });
            console.log()
            res.send({ files: files })
        }
    });
});



// // @route GET /files
router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }

        // Files exist
        
        return res.json(files);
    });
});

// // @route GET /files/:filename
router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // File exists
        return res.json(file);
    });
});

router.get('/audio/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

        // Check if audio
        if (file.contentType === 'audio/mpeg' || file.contentType === 'audio/mpeg') {
            // Read output to browser
            const readStream = gridfsBucket.openDownloadStream(file._id);
            readStream.pipe(res)
        } else {
            res.status(404).json({
                err: 'Not a mp3'
            });
        }
    });
});

module.exports = router;