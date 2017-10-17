const chai = require('chai');
const chaiHttp = require('chai-http');
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

// Database seeding fxns.:
// Seed a User with just username & hashed password - for use with tests where inserting a whiskey post for 1st time + authentication/authorization.
function userAndPassData() {
  const userAndPass = {
    username: faker.name.firstName(),
    password: faker.internet.password()
  };
  console.log('userAndPass: ' + JSON.stringify(userAndPass));
  return User.create(userAndPass);
}

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


describe('User signup & login', function() {

  before(() => runServer(TEST_DATABASE_URL));
  // beforeEach(() => userAndPassData());
  // afterEach(() => tearDownDb());
  after(() => closeServer());

    it('should allow a user to signup & save username & p/w to DB', function() {
      let testUserName = faker.name.firstName().toLowerCase();
      let plainEnglishPassword = faker.internet.password();
      return chai
        .request(app)
        .post('/signup')
        .send({
          username: testUserName,
          password: plainEnglishPassword
        })
        .then(() => {
        // let testUser;
        return testUser =
        User
        .findOne({username: testUserName})
        console.log('User.findOne: ', {username: testUserName});
        console.log('username: ', username);
        })
        .then(user => {
          console.log('user: ' + user);
          expect(user).to.not.be.null;
          expect(user.username).to.equal(testUserName);
          expect(user.password).to.not.equal(plainEnglishPassword);
        })
      });

    });

    // it('Should reject requests with no credentials', function() {
    //   return chai
    //     .request(app)
    //     .post('/login')
    //     .then(() =>
    //       should.fail(null, null, 'Request should not succeed') // make into expect
    //     )
    //     .catch(err => {
    //       if (err instanceof chai.AssertionError) {
    //           throw err;
    //       }
    //       const res = err.response;
    //       expect(res).to.have.status(401);
    //       // res.should.have.status(401);
    //     });
    // });

// });



// describe('GET endpoint', function() {

//   before(() => runServer(TEST_DATABASE_URL));
//   beforeEach(() => fullUserData());
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










  // const username = "user1"
  // const password = "password10"

  // before(() => runServer(TEST_DATABASE_URL));
  // after(() => closeServer());

  // beforeEach(() => {
  //   newUser = new User();
  //   newUser.username = username;
  //   newUser.password = newUser.generateHash(password);
  //   newUser.save();
  //   return newUser;
  // });

  // // console.log('newUser: ' + JSON.stringify(newUser));  // jack fucking squat
  // beforeEach(() => {
  //   return User
  //     .generateHash(password)
  //     .then(password => {
  //       User.create({
  //         username,
  //         password
  //       })
  //     });
  //   // return User;
  // });

  // afterEach(() => User.remove({}));









