const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

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

//login form post

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
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
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash('error_msg', 'Email Already Registerd');
        res.redirect('/users/register');
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
                req.flash(
                  'success_msg',
                  'You are now registerd and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => {
                console.log(err);
              });
          });
        });
      }
    });
  }
});

//logout user

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_mgs', 'You are Logged Out');
  res.redirect('/users/login');
});

module.exports = router;
