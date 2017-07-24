const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path   = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();

const badgeRouter = require('./routes/badgeRouter');
const whiskeyprofileRouter = require('./routes/whiskey-profileRouter');
// const userRouter = require('./routes/userRouter');
const passportRouter = require('./routes/passportRouter');

// app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/views/index.html');
// });

// app.get('/login', (req, res) => {
//   res.sendFile(__dirname + '/public/views/login.html');
// });

const {DATABASE_URL, PORT} = require('./config');

app.use(morgan('common'));
app.use(jsonParser);
app.use('/badges', badgeRouter);
app.use('/whiskey-profile', whiskeyprofileRouter);
// app.use('/user', userRouter);
app.use('/auth', passportRouter);


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
