'use strict';

const express = require('express');
const morgan = require('morgan');
const app = express();

const { PORT } = require('./config');

const router = require('./router/notes_router');

// const { myLogger } = require('./middleware/logger');
//Output format is :method :url :status :response-time ms - :res[content-length]
app.use(morgan('common'));

// TEMP: Simple In-Memory Database
// const data = require('./db/notes');
// const simDB = require('./db/simDB');
// console.log(simDB.initialize);
// const notes = simDB.initialize(data);

// Create a static webserver
app.use(express.static('public'));

//Parse request body
app.use(express.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  next();
});

//Mount router module on the path
app.use('/api/notes', router);

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

// Listen for incoming connections
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

