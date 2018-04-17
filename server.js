'use strict';

const express = require('express');

const app = express();

const { PORT } = require('./config');

const { myLogger } = require('./middleware/logger');

// TEMP: Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

app.use(express.static('public'));
app.use(express.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  next();
});

app.use(myLogger);

// const myMiddleWareFunc = (req, res, next) => {
//   console.log(req.url);
//   next();
// };

// const requestLogger = (req, res, next) => {
//   const now = new Date();
//   console.log(
//     `${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${req.method} ${req.url}`
//   );
//   next();
// };
//
// // app.use(myMiddleWareFunc);
// app.use(requestLogger);
//
// app.get('/url-1', requestLogger, (req, res) => res.send('request made to /url-1'));


app.get('/api/notes', (req, res, next) => {
  console.log('searching notes');

  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});


// route function
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    res.json(item);
  });
 });

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

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

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json
// });


// Listen for incoming connections
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

