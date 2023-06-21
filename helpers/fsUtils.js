const fs = require('fs');

const appendToNotes = (note) => {
    fs.readFile('./db/db.json', 'utf8', (error, fileData) => {
        if (error) {
            console.error('Read file error', error);
        } else {
            // Parse data to JSON
            const existingNotes = JSON.parse(fileData);

            // Append the new note
            existingNotes.push(note);

            // Write the updated notes back to the file
            fs.writeFile(
                './db/db.json', JSON.stringify(existingNotes, null, 4), (writeError) =>
                writeError
                    ? console.error('Write file error', writeError)
                    : console.info('Note addition successful!')
            );
        }
    });
};

module.exports = appendToNotes;
