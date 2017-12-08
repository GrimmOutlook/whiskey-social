'use strict';
require('dotenv').config();
const path   = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const methodOverride = require('method-override');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const {router: usersRouter} = require('./users');
const {router: whiskeyRouter} = require('./whiskeys');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');  //why not require('.auth/index.js')?

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Static files, views
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));  //require path needed?

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);     // old - return res.sendStatus(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/', usersRouter);  // signup   '/api/users/'
app.use('/', authRouter);    // login    '/api/auth/'
app.use('/', whiskeyRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
      console.log('req.user is: ' + req.user);
      console.log('Does this work?');
        return res.json({
            data: 'rosebud'
        });
    }
);

app.use('*', (req, res) => {
  return res.status(404).json({message: 'Not Found'});
});

// launch ======================================================================
let server;

// old - function runServer(databaseUrl=DATABASE_URL, port=PORT) {
function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};

