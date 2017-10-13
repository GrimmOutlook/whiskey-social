// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const User = require('../app/models/users');   //needed??
// const Whiskey = require('../app/models/whiskeys');   //needed??

// const should = chai.should();

// const {app, runServer, closeServer} = require('../server');
// const {TEST_DATABASE_URL} = require('../config/database');

// chai.use(chaiHttp);

// describe('GET endpoint', function() {

//   before(() => runServer(TEST_DATABASE_URL));
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

//     //Why the fuck does this pass?  It's a protected endpoint!!!!!!!!!!!!
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

// describe('User signup & login', function() {
//   // let newUser = {};
//   const username = "user1"
//   const password = "password10"

  // before(() => runServer(TEST_DATABASE_URL));
  // after(() => closeServer());

//   // beforeEach(() => {
//   //   newUser = new User();
//   //   newUser.username = username;
//   //   newUser.password = newUser.generateHash(password);
//   //   newUser.save();
//   //   return newUser;
//   // });

//   // console.log('newUser: ' + JSON.stringify(newUser));  // jack fucking squat
//   beforeEach(() => {
//     return User
//       .generateHash(password)
//       .then(password => {
//         User.create({
//           username,
//           password
//         })
//       });
//     // return User;
//   });

  // afterEach(() => User.remove({}));

    // describe('/login', function() {

    //   it('Should reject requests with no credentials', function() {
    //     return chai
    //       .request(app)
    //       .post('/login')
    //       .then(() =>
    //         should.fail(null, null, 'Request should not succeed')
    //       )
    //       .catch(err => {
    //         if (err instanceof chai.AssertionError) {
    //             throw err;
    //         }
    //         const res = err.response;
    //         res.should.have.status(401);
    //         // expect(res).to.have.status(401);
    //       });
    //   });
    // });



    // it('should allow a user to signup & save username & p/w to DB', function() {

    // });

// });












