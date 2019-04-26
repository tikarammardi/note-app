const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

//load note MOdel

require('../models/Notes');
const Note = mongoose.model('notes');

//note index page

router.get('/', (req, res) => {
  Note.find({})
    .sort({ date: 'desc' })
    .then(notes => {
      res.render('notes/index', {
        notes
      });
    });
});

//add note form

router.get('/add', (req, res) => {
  res.render('notes/add');
});

//edit note form
router.get('/edit/:id', (req, res) => {
  Note.findOne({ _id: req.params.id }).then(note => {
    res.render('notes/edit', {
      note
    });
  });
});

//process form

router.post('/', (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Title is required' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Details is required ' });
  }

  if (errors.length > 0) {
    res.render('notes/add', {
      errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Note(newUser).save().then(note => {
      res.redirect('/notes');
    });
  }
});

//Edit form process

router.put('/:id', (req, res) => {
  Note.findOne({
    _id: req.params.id
  }).then(note => {
    //new values;
    (note.title = req.body.title), (note.details = req.body.details);

    note.save().then(note => {
      res.redirect('/notes');
    });
  });
});

//delete Note
router.delete('/:id', (req, res) => {
  Note.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.redirect('/notes');
  });
});

module.exports = router;
