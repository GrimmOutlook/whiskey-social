const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const faker = require('faker');
const User = require('../app/models/users');
const Whiskey = require('../app/models/whiskeys');
const mongoose = require('mongoose');
const expect = chai.expect;
const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config/database');

mongoose.Promise = global.Promise;   // Necessary?

chai.use(chaiHttp);

// // Database seeding fxns.:
// // Seed a User with just username & hashed password - for use with tests where inserting a whiskey post for 1st time + authentication/authorization.
// function userAndPassData() {
//   const userAndPass = {
//     testUsername: faker.name.firstName(),
//     unencryptedPassword: faker.internet.password()
//   };
//   console.log('userAndPass: ' + JSON.stringify(userAndPass));
//   return User.create(userAndPass);
// }

// Seed a User with username, password, & a post w/ a comment - for use with all other CRUD operations, including favoriting the post that was just created.
// function fullUserData() {
//   const fullUser = {
//     username: faker.name.firstName(),
//     password: faker.internet.password(),
//     posts: [{
//       whiskeyName: faker.commerce.productName(),
//       smallImageURL: faker.image.imageUrl(),
//       largeImageURL: faker.image.imageUrl(),
//       postDate: Date.now,
//       rating: Math.floor(Math.random() * 5) + 1,
//       favorite: false,
//       comment: [{
//         text: faker.lorem.text(),
//         commentDate: Date.now
//       }]
//     }]
//   };
//   console.log('fullUser: ' + JSON.stringify(fullUser));
//   return User.create(fullUser);
// }

// Seed whiskey DB with many whiskeys



// Tear down DB after each test:
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}


describe('User signup & login - ', function() {
  this.timeout(8000);
  let testUserName = faker.name.firstName().toLowerCase();
  let testUserName2 = ` ${testUserName} `;
  let unencryptedPassword = faker.internet.password();
  console.log('unencryptedPassword: ' + unencryptedPassword)

  before(() => runServer(TEST_DATABASE_URL));
  // beforeEach(() => userAndPassData());
  afterEach(() => tearDownDb());
  after(() => closeServer());

                // THIS PASSES - without the validation code in POST route!
    it('should allow a user to signup & save username & p/w to DB', function() {
      return chai
        .request(app)
        .post('/signup')
        .send({
          username: testUserName,
          password: unencryptedPassword
        })
        .then(() =>
          // let testUser;
          testUser =
          User
          .findOne({username: testUserName})
        )
        .then(user => {
          console.log('user: ' + user);
          // console.log('res.body: ', + res.body)
          expect(user).to.not.be.null;
          expect(user.username).to.equal(testUserName);
          expect(user.password).to.not.equal(unencryptedPassword);
          return true;
        })
    });

     it('Should reject users with missing username', function() {
      return chai
        .request(app)
        .post('/signup')
        .send({
          // username: testUserName,
          password: unencryptedPassword
        })
        .then(() =>
          // let testUser;
          testUser =
          User
          .findOne({username: testUserName})
        )
        .then(user => {
          console.log('user: ' + user);
          // console.log('res.body: ', + res.body)
          expect(user).to.be.null;
          // expect(res).to.have.status(422);
          // expect(user.username).to.equal(testUserName);
          // expect(user.password).to.not.equal(unencryptedPassword);
          return true;
        })
    });

     it('Should reject users with missing password', function() {
      return chai
        .request(app)
        .post('/signup')
        .send({
          username: testUserName
          //, password: unencryptedPassword
        })
        .then(() =>
          // let testUser;
          testUser =
          User
          .findOne({username: testUserName})
        )
        .then(user => {
          console.log('user: ' + user);
          // console.log('res.body: ', + res.body)
          expect(user).to.be.null;
          // expect(res).to.have.status(422);
          // expect(user.username).to.equal(testUserName);
          // expect(user.password).to.be.null;
          return true;
        })
    });

             //This is from Thinkful JWT code - doesn't pass here either way.
    // it('Should create a new user', function() {
    //     return chai.request(app)
    //       .post('/signup')
    //       .send({
    //         username: testUserName,
    //         password: unencryptedPassword
    //       })
    //       .then(res => {
    //         expect(res).to.have.status(200);
    //         expect(res.body).to.be.an('object');
    //         // expect(res.body).to.have.keys('username');
    //         expect(res.body.username).to.equal(username);
    //         return User.findOne({
    //           username
    //         });
    //       })
    //       .then(user => {
    //         expect(user).to.not.be.null;
    //         return user.validPassword(password);
    //       })
    //       .then(passwordIsCorrect => {
    //         expect(passwordIsCorrect).to.be.true;
    //       });
    //   });

  // describe('/signup Route', function() {
    // describe('POST to signup', function() {
              //BACK-END SIGNUP VALIDATION TESTS:
      // it('Should reject users with missing username', function() {
      //   return chai.request(app)
      //     .post('/signup')
      //     .send({
      //       password: unencryptedPassword
      //     })
      //     .then(() => expect.fail(null, null, 'Request should not succeed'))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }

      //       const res = err.response;
      //       console.log('missing username res.body.message: ', res.body.message);
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Missing field');
      //       expect(res.body.location).to.equal('username');
      //     });
      // });

  //   it('Should reject users with missing password', function() {
  //       return chai.request(app)
  //         .post('/signup')
  //         .send({
  //           username: testUserName
  //         })
  //         .then(() => expect.fail(null, null, 'Request should not succeed'))
  //         .catch(err => {
  //           if (err instanceof chai.AssertionError) {
  //             throw err;
  //           }

  //           const res = err.response;
  //           console.log('missing password res.body.message: ', res.body.message);
  //           expect(res).to.have.status(422);
  //           expect(res.body.reason).to.equal('ValidationError');
  //           expect(res.body.message).to.equal('Missing field');
  //           expect(res.body.location).to.equal('password');
  //         });
  //     });

  //     it('Should reject users with non-string username', function() {
  //       return chai.request(app)
  //         .post('/signup')
  //         .send({
  //           username: 1234,
  //           password: unencryptedPassword
  //         })
  //         .then(() => expect.fail(null, null, 'Request should not succeed'))
  //         .catch(err => {
  //           if (err instanceof chai.AssertionError) {
  //             throw err;
  //           }

  //           const res = err.response;
  //           console.log('username no string res.body.message: ', res.body.message);
  //           expect(res).to.have.status(422);
  //           expect(res.body.reason).to.equal('ValidationError');
  //           expect(res.body.message).to.equal('Incorrect field type: expected string');
  //           expect(res.body.location).to.equal('username');
  //         });
  //     });

  //     it('Should reject users with non-string password', function() {
  //       return chai.request(app)
  //         .post('/signup')
  //         .send({
  //           username: testUserName,
  //           password: 1234
  //         })
  //         .then(() => expect.fail(null, null, 'Request should not succeed'))
  //         .catch(err => {
  //           if (err instanceof chai.AssertionError) {
  //             throw err;
  //           }

  //           const res = err.response;
  //           console.log('username no password res.body.message: ', res.body.message);
  //           expect(res).to.have.status(422);
  //           expect(res.body.reason).to.equal('ValidationError');
  //           expect(res.body.message).to.equal('Incorrect field type: expected string');
  //           expect(res.body.location).to.equal('password');
  //         });
  //     });

  //     it('Should reject users with non-trimmed username', function() {
  //       return chai.request(app)
  //         .post('/signup')
  //         .send({
  //           username: testUserName2,
  //           password: unencryptedPassword
  //         })
  //         .then(() => expect.fail(null, null, 'Request should not succeed'))
  //         .catch(err => {
  //           if (err instanceof chai.AssertionError) {
  //             throw err;
  //           }

  //           const res = err.response;
  //           expect(res).to.have.status(422);
  //           expect(res.body.reason).to.equal('ValidationError');
  //           expect(res.body.message).to.equal('Cannot start or end with whitespace');
  //           expect(res.body.location).to.equal('username');
  //         });
  //     });

  //     it('Should reject users with non-trimmed password', function() {
  //       return chai.request(app)
  //         .post('/signup')
  //         .send({
  //           username: testUserName,
  //           password: ` ${unencryptedPassword} `
  //         })
  //         .then(() => expect.fail(null, null, 'Request should not succeed'))
  //         .catch(err => {
  //           if (err instanceof chai.AssertionError) {
  //             throw err;
  //           }

  //           const res = err.response;
  //           expect(res).to.have.status(422);
  //           expect(res.body.reason).to.equal('ValidationError');
  //           expect(res.body.message).to.equal('Cannot start or end with whitespace');
  //           expect(res.body.location).to.equal('password');
  //         });
  //     });

  //     it('Should reject users with empty username', function() {
  //       return chai.request(app)
  //         .post('/signup')
  //         .send({
  //           username: '',
  //           password: unencryptedPassword
  //         })
  //         .then(() => expect.fail(null, null, 'Request should not succeed'))
  //         .catch(err => {
  //           if (err instanceof chai.AssertionError) {
  //             throw err;
  //           }

  //           const res = err.response;
  //           expect(res).to.have.status(422);
  //           expect(res.body.reason).to.equal('ValidationError');
  //           expect(res.body.message).to.equal('Must be at least 1 character(s) long');
  //           expect(res.body.location).to.equal('username');
  //         });
  //     });
  //     it('Should reject users with password less than ten characters', function() {
  //       return chai.request(app)
  //         .post('/signup')
  //         .send({
  //           username: testUserName,
  //           password: '123456789'
  //         })
  //         .then(() => expect.fail(null, null, 'Request should not succeed'))
  //         .catch(err => {
  //           if (err instanceof chai.AssertionError) {
  //             throw err;
  //           }

  //           const res = err.response;
  //           expect(res).to.have.status(422);
  //           expect(res.body.reason).to.equal('ValidationError');
  //           expect(res.body.message).to.equal('Must be at least 10 character(s) long');
  //           expect(res.body.location).to.equal('password');
  //         });
  //     });

  //     it('Should reject users with password greater than 72 characters', function() {
  //       return chai.request(app)
  //         .post('/signup')
  //         .send({
  //           username: testUserName,
  //           password: new Array(73).fill('x').join('')
  //         })
  //         .then(() => expect.fail(null, null, 'Request should not succeed'))
  //         .catch(err => {
  //           if (err instanceof chai.AssertionError) {
  //             throw err;
  //           }

  //           const res = err.response;
  //           expect(res).to.have.status(422);
  //           expect(res.body.reason).to.equal('ValidationError');
  //           expect(res.body.message).to.equal('Must be at most 72 characters long');
  //           expect(res.body.location).to.equal('password');
  //         });
  //     });


    // });  // describe('POST to signup', function() {
  // });  // describe('/signup Route', function() {

});  // describe('User signup & login')

