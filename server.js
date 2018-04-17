'use strict';

// TEMP: Simple In-Memory Database
const data = require('./db/notes');

const express = require('express');

const { PORT } = require('./config');

const { myLogger } = require('./middleware/logger');

const app = express();


app.use(express.static('public'));

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


// route function
app.get('/api/notes', (req, res) => {
  console.log('searching notes');
  const searchTerm = req.query.searchTerm;
  if (searchTerm) {
    res.json(data.filter(note => note.title.includes(searchTerm) || note.content.includes(searchTerm)));
  } else {
    res.json(data);
  }

});

// route function
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const myNote = data.find(item => item.id === Number(id));
  console.log(myNote);
  res.json(myNote);
 });





app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json
});


// Listen for incoming connections
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

