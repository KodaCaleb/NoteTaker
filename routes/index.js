const express = require('express');

const notesRoute = require('./notes.js');

const app = express();

app.use('/notes', notesRoute);

module.exports = app;
