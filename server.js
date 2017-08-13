const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path   = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();

const whiskeyRouter = require('./routes/whiskeyRouter');
const passportRouter = require('./routes/passportRouter');
const userRouter = require('./routes/userRouter');

// app.use(express.static('public'));
app.use('/', express.static(path.join(__dirname, 'public/views')));

const {DATABASE_URL, PORT} = require('./config');

app.use(morgan('common'));
app.use(jsonParser);
app.use('/user', userRouter);
app.use('/whiskey', whiskeyRouter);
// app.use('/user', userRouter);
app.use('/signup', passportRouter);  //use / as route, then /signup & /login in router?
//Use sessions for tracking logins:
// app.use(session, {
//   secret: 'whiskey in the jar', //
//   resave: true,                 //
//   saveUninitialized: false      //
// });

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
