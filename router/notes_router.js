'use strict';

//Add Express
const express = require('express');

//Express Router is mini express application that takes care of the routing
//express.Router is an instance that is complete middleware and routing system
//Create instance of router by calling Router()
const router = express.Router();

// TEMP: Simple In-Memory Database
const data = require('../db/notes');
const simDb = require('../db/simDB');
const notes = simDb.initialize(data);

//Get All notes. If query exists, filter notes
router.get('/', (req, res, next) => {
  console.log('searching notes');
  const { searchTerm } = req.query;

  notes.filter(searchTerm)
    .then(list => {
      res.json(list); // responds with filtered array
    })
    .catch(err => {
      next(err);
    });
});

//Get note that matches id parameter
router.get('/:id', (req, res) => {
  const id = +req.params.id;

  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

//Update note that matches id parameter
router.put('/:id', (req, res, next) => {

  const id = +req.params.id;

  console.log(`updating ${id} note`);

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.update(id, updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

//Create (insert) new item
router.post('/', (req, res, next) => {
  console.log('creating new item');
  console.log(req.body);

  const {title, content} = req.body;

  const newItem = { title, content };

  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem)
    .then(item => {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const id = +req.params.id;

  console.log(`Deleting ${id} note`);

  notes.delete(id)
    .then(() => {
      res.sendStatus(204);
      // res.status(204).send('No Content').end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;