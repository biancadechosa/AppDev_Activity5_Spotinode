const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/songs'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name
    }
});
const upload = multer({ storage: storage });

// Get all playlists
// Get all playlists (Homepage)
router.get('/', (req, res) => {
    db.query('SELECT * FROM playlist', (err, results) => {
        if (err) throw err;
        res.render('index', { playlist: results });
    });
});


// Add a new playlist
router.post('/playlist', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO playlist (name) VALUES (?)', [name], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Edit a playlist name
router.post('/playlist/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    db.query('UPDATE playlist SET name = ? WHERE id = ?', [name, id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Delete a playlist
router.post('/playlist/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM playlist WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Get songs in a specific playlist
router.get('/playlist/:id/songs', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM spotinode WHERE playlist_id = ?', [id], (err, songs) => {
        if (err) throw err;
        db.query('SELECT * FROM playlist WHERE id = ?', [id], (err, playlist) => {
            if (err) throw err;
            res.render('playlist', { spotinode: songs, playlist: playlist[0], playlistId: id });
        });
    });
});

// Add a song to the playlist
router.post('/playlist/:id/songs', upload.single('song_file'), (req, res) => {
    const { id } = req.params;
    const { title, singer } = req.body;
    const songFile = req.file.filename; // Store the filename
    const songPath = `/songs/${songFile}`; // Create the path to the song
    db.query('INSERT INTO spotinode (title, singer, song_path, playlist_id) VALUES (?, ?, ?, ?)', 
        [title, singer, songPath, id], (err) => {
        if (err) throw err;
        res.redirect(`/playlist/${id}/songs`);
    });
});



// Delete a song from a playlist
router.post('/song/delete/:id', (req, res) => {
    const { id } = req.params;
    const { playlistId } = req.body;
    db.query('DELETE FROM spotinode WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect(`/playlist/${playlistId}/songs`);
    });
});

module.exports = router;
