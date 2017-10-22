// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const mocha = require('mocha');
// // const describe = mocha.describe;
// // const it = mocha.it;
// // const faker = require('faker');
// const User = require('../app/models/users');
// const Whiskey = require('../app/models/whiskeys');
// const mongoose = require('mongoose');
// const expect = chai.expect;
// const should = chai.should();

// const {app, runServer, closeServer} = require('../server');
// const {TEST_DATABASE_URL} = require('../config/database');

// mongoose.Promise = global.Promise;   // Necessary?

// chai.use(chaiHttp);


// // Tear down DB after each test:
// function tearDownDb() {
//   console.warn('Deleting database');
//   return mongoose.connection.dropDatabase();
// }

// describe('GET endpoint', function() {

//   before(() => runServer(TEST_DATABASE_URL));
//   // beforeEach(() => userAndPassData());
//   afterEach(() => tearDownDb());
//   after(() => closeServer());

//     it('should return a 200 status & HTML - homepage', function() {
//       let res;
//       return chai
//         .request(app)
//         .get('/')
//         .then(function(_res) {
//           res = _res;
//           console.log(res.status);
//           res.should.have.status(200);
//           res.should.be.html;
//           console.log(`Your status is ${res.status}.`);
//         });
//     });

//     it('should return a 200 status & HTML - signup', function() {
//       let res;
//       return chai
//         .request(app)
//         .get('/signup')
//         .then(function(_res) {
//           res = _res;
//           console.log(res.status);
//           res.should.have.status(200);
//           res.should.be.html;
//           console.log(`Your status is ${res.status}.`);
//         });
//     });

//     it('should return a 200 status & HTML - login', function() {
//       let res;
//       return chai
//         .request(app)
//         .get('/login')
//         .then(function(_res) {
//           res = _res;
//           console.log(res.status);
//           res.should.have.status(200);
//           res.should.be.html;
//           console.log(`Your status is ${res.status}.`);
//         });
//     });

//     // Why the fuck does this pass?  It's a protected endpoint!!!!!!!!!!!!
//     it('should return a 200 status & HTML - profile', function() {
//       let res;
//       return chai
//         .request(app)
//         .get('/profile')
//         .then(function(_res) {
//           res = _res;
//           console.log(res.body);
//           res.should.have.status(200);
//           res.should.be.html;
//           console.log(`Your status is ${res.status}.`);
//         });
//     });

// });



