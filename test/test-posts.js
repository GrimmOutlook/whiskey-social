// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const mocha = require('mocha');
// const describe = mocha.describe;
// const it = mocha.it;
// const faker = require('faker');
// const User = require('../app/models/users');
// const bcrypt = require('bcrypt-nodejs');
// const Whiskey = require('../app/models/whiskeys');
// const mongoose = require('mongoose');
// const expect = chai.expect;
// const should = chai.should();
// const path   = require('path');
// const passport = require('passport');

// // const express  = require('express');
// // const app      = express();

// const {app, runServer, closeServer} = require('../server');
// const {TEST_DATABASE_URL} = require('../config/database');

// // app = require(path.join(process.cwd(), './server.js')),
// const passportMock = require(path.join(process.cwd(), 'config', 'mock-passport'));

// mongoose.Promise = global.Promise;   // Necessary?

// chai.use(chaiHttp);


// // Tear down DB after each test:
// function tearDownDb() {
//   console.warn('Deleting database');
//   return mongoose.connection.dropDatabase();
// }


// describe('GET a protected endpoint ', () => {
//   // this.timeout(8000);
//   var agent = chai.request.agent(app)

//    before(() => {
//     runServer(TEST_DATABASE_URL)
//     ?????????? passReqToCallback : true ???????????????????????
//     // app.request.isAuthenticated = () => true;
//   });
//   // beforeEach(() => seedUser());
//   beforeEach(done => {
//     passportMock(app, {
//       passAuthentication: true,
//       userId: 1
//     });
//     agent
//       .get('/mock/login')
//       .end((err, result) => {
//         if (!err) {
//           chai.save(result.res);
//           // expect(res).to.have.cookie(result.res);
//           done();
//         } else {
//           done(err);
//         }
//       });
//   })
//   // afterEach(() => tearDownDb());
//   after(() => closeServer());


//     it('I just want to write one passing test before the end of 2017 ', done => {
//       return agent
//         .get('/profile');
//           // console.log('Is the test even getting here?');
//         function (res) {
//           expect(res).to.have.status(200);
//           console.log('res.text: ' + res.text)
//         }
//           // expect(req.status).to.equal(200), done();
//     });  // it

// });  // describe()
