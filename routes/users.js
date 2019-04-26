const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//const passport = require('passport');

const router = express.Router();
require('../models/Users');
const User = mongoose.model('users');

//User login route
router.get('/login', (req, res) => {
  res.render('users/login');
});

//User register route
router.get('/register', (req, res) => {
  res.render('users/register');
});

//Register form post
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password !== req.body.password2) {
    errors.push({ text: 'Password Do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters long' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            req.flash('success_msg', 'You are now registerd and can log in');
            res.redirect('users/login');
          })
          .catch(err => {
            console.log(err);
          });
      });
    });

    res.send('passed');
  }
});

module.exports = router;
