const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/**
 * Handles the incoming POST request for the users sign up / create a user
 */
exports.users_sign_up_user = (req, res, next) => {
  User.find({ email: req.body.email }).then(user => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: 'Email exists'
      });
    } else {
      bcrypt.hash(req.body.password, null, null, (err, hash) => {
        console.log(hash);
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          });

          user
            .save()
            .then(result => {
              console.log(result);
              res.status(201).json({
                message: 'User created'
              });
            })
            .catch(err => {
              res.status(500).json({
                error: err
              });
            });
        }
      });
    }
  });
};

/**
 * Handles the incoming POST request for the users login
 */
exports.users_login_user = (req, res, next) => {
  const email = req.body.email;
  User.find({ email })
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Authentication failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Authentication failed'
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h'
            }
          );
          return res.status(200).json({
            message: 'Auth successful',
            token
          });
        }
        return res.status(401).json({
          message: 'Authentication failed'
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

/**
 * Handles the incoming DELETE request for the single user
 */
exports.users_delete_user = (req, res, next) => {
  const id = req.params.id;
  User.deleteOne({ _id: id })
    .then(result => {
      res.status(200).json({
        message: 'User Deleted'
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
