const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const db = require('./config/db');
const routes = require('./routes/router');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
app.use(express.static('public'));
/* Start for playlist */

// Get all playlists
app.get('/', (req, res) => {
    db.query('SELECT * FROM playlist', (err, results) => {
        if (err) throw err;
        res.render('index', { playlist: results }); // Pass results to the view
    });
});

// Add a new playlist
app.post('/playlist', (req, res) => {
    const { name } = req.body; // Get the playlist name from the request body
    db.query('INSERT INTO playlist (name) VALUES (?)', [name], (err) => {
        if (err) throw err;
        res.redirect('/'); // Redirect to the homepage
    });
});

// Edit a playlist name
app.post('/playlist/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body; // Get the new name for the playlist

    db.query('UPDATE playlist SET name = ? WHERE id = ?', [name, id], (err) => {
        if (err) throw err;
        res.redirect('/'); // Redirect to the homepage
    });
});

// Delete a playlist and its songs
app.post('/playlist/delete/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM playlist WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/'); // Redirect to the homepage
    });
});



/* End for playlist */


app.listen(3000, () => {
    console.log('Server initialized on http://localhost:3000');
});
