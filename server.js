'use strict';

// TEMP: Simple In-Memory Database
const data = require('./db/notes');

const express = require('express');

const app = express();


app.use(express.static('public'));

// app.get('/api/notes', (req, res) => {
//   // console.log(data);
//   res.json(data);
// });
const myMiddleWareFunc = (req, res, next) => {
  console.log(req.url);
  next();
};

const requestLogger = (req, res, next) => {
  const now = new Date();
  console.log(
    `${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${req.method} ${req.url}`
  );
  next();
};

// app.use(myMiddleWareFunc);
app.use(requestLogger);

app.get('/url-1', requestLogger, (req, res) => res.send('request made to /url-1'));

// route function
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const myNote = data.find(item => item.id === Number(id));
  console.log(myNote);
  res.json(myNote);
 });

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



console.log('hello');

// Listen for incoming connections
app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});