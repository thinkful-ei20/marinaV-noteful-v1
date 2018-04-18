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
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

//Get note that matches id parameter
router.get('/:id', (req, res) => {
  const id = req.params.id;
  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    res.json(item);
  });
});

//Update note that matches id parameter
router.put('/:id', (req, res, next) => {
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



module.exports = router;