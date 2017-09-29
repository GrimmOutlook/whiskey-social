const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path   = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jsonParser = bodyParser.json();
const methodOverride = require('method-override');
const passport = require('passport');
const Strategy = require('passport-http').BasicStrategy;

const app = express();

const whiskeyRouter = require('./routes/whiskeyRouter');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');

// app.use(express.static('public'));
app.use('/', express.static(path.join(__dirname, 'public/')));

const {DATABASE_URL, PORT} = require('./config');

app.use(morgan('common'));
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use('/user', userRouter);
app.use('/whiskey', whiskeyRouter);
app.use('/', authRouter);  //use / as route, then /signup & /login in router?
//Use sessions for tracking logins:
// app.use(session, {
//   secret: 'whiskey in the jar', //
//   resave: true,                 //
//   saveUninitialized: false      //
// });


app.use(cookieParser());
app.use(session({ secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());




mongoose.Promise = global.Promise;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './public/views'));


let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
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
