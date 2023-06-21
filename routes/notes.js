const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const appendToNotes = require('../helpers/fsUtils');
const fs = require('fs');
const path = require('path');

// Route for fetching all notes
router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.status(200).json(JSON.parse(data));
    });
});

// Route for fetching specific note by ID
router.get('/:noteId', (req, res) => {
    const noteId = req.params.noteId;
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const notes = JSON.parse(data);
        const note = notes.find(n => n.id === noteId);
        note ? res.json(note) : res.status(404).json({message: 'Note not found'});
    });
});

// Route for adding new note
router.post('/', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };
        appendToNotes(newNote, path.join(__dirname, '../db/db.json'));
        res.json({
            status: 'success',
            note: newNote,
        });
    } else {
        res.json({ message: 'Error in adding new note' });
    }
});

// Route for deleting note by ID
router.delete('/:noteId', (req, res) => {
    const noteId = req.params.noteId;
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let notes = JSON.parse(data);
        const noteIndex = notes.findIndex(n => n.id === noteId);
        if (noteIndex !== -1) {
            notes = notes.filter(n => n.id !== noteId);
            fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes, null, 4), (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                    return;
                }
                console.info('Note successfully removed!');
            });
            res.json(notes);
        } else {
            res.status(404).json({ message: 'Note not found' });
        }
    });
});

module.exports = router;
