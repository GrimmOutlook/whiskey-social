// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const mocha = require('mocha');
// const describe = mocha.describe;
// const it = mocha.it;
// const faker = require('faker');
// const User = require('../app/models/users');
// const Whiskey = require('../app/models/whiskeys');
// const mongoose = require('mongoose');
// const expect = chai.expect;
// const should = chai.should();

// const {app, runServer, closeServer} = require('../server');
// const {TEST_DATABASE_URL} = require('../config/database');

// mongoose.Promise = global.Promise;   // Necessary?

// chai.use(chaiHttp);

// // // Database seeding fxns.:
// // // Seed a User with just username & hashed password - for use with tests where inserting a whiskey post for 1st time + authentication/authorization.
// // function userAndPassData() {
// //   const userAndPass = {
// //     testUsername: faker.name.firstName(),
// //     unencryptedPassword: faker.internet.password()
// //   };
// //   console.log('userAndPass: ' + JSON.stringify(userAndPass));
// //   return User.create(userAndPass);
// // }

// // Seed a User with username, password, & a post w/ a comment - for use with all other CRUD operations, including favoriting the post that was just created.
// // function fullUserData() {
// //   const fullUser = {
// //     username: faker.name.firstName(),
// //     password: faker.internet.password(),
// //     posts: [{
// //       whiskeyName: faker.commerce.productName(),
// //       smallImageURL: faker.image.imageUrl(),
// //       largeImageURL: faker.image.imageUrl(),
// //       postDate: Date.now,
// //       rating: Math.floor(Math.random() * 5) + 1,
// //       favorite: false,
// //       comment: [{
// //         text: faker.lorem.text(),
// //         commentDate: Date.now
// //       }]
// //     }]
// //   };
// //   console.log('fullUser: ' + JSON.stringify(fullUser));
// //   return User.create(fullUser);
// // }

// // Seed whiskey DB with many whiskeys



// // Tear down DB after each test:
// function tearDownDb() {
//   console.warn('Deleting database');
//   return mongoose.connection.dropDatabase();
// }


// describe('User signup & login - ', function() {
//   this.timeout(8000);
//   let testUserName = faker.name.firstName().toLowerCase();
//   let testUserName2 = ` ${testUserName} `;
//   let testUserNameLong = new Array(73).fill('x').join('');
//   let unencryptedPassword = faker.internet.password();
//   console.log('unencryptedPassword: ' + unencryptedPassword)

//   before(() => runServer(TEST_DATABASE_URL));
//   // beforeEach(() => userAndPassData());
//   afterEach(() => tearDownDb());
//   after(() => closeServer());

//     it('should allow a user to signup & save username & p/w to DB', () => {
//       return chai
//         .request(app)
//         .post('/signup')
//         .send({
//           username: testUserName,
//           password: unencryptedPassword
//         })
//         .then(() =>
//           User
//           .findOne({username: testUserName})
//         )
//         .then(user => {
//           console.log('user: ' + user);
//           expect(user).to.not.be.null;
//           expect(user.username).to.equal(testUserName);
//           expect(user.password).to.not.equal(unencryptedPassword);
//           // return true;
//         })
//     });

//      it('Should reject users with missing username', () => {
//       return chai
//         .request(app)
//         .post('/signup')
//         .send({
//           password: unencryptedPassword
//         })
//         .then(() =>
//           User
//           .findOne({username: testUserName})
//         )
//         .then(user => {
//           console.log('user: ' + user);
//           expect(user).to.be.null;
//           // return true;
//         })
//     });

//     it('Should reject users with missing password', () => {
//       return chai
//         .request(app)
//         .post('/signup')
//         .send({
//           username: testUserName
//         })
//         .then(() =>
//           User
//           .findOne({username: testUserName})
//         )
//         .then(user => {
//           console.log('user: ' + user);
//           expect(user).to.be.null;
//           // return true;
//         })
//     });

//     it('Should reject users with non-string username', () => {
//       return chai
//         .request(app)
//         .post('/signup')
//         .send({
//           username: 1234,
//           password: unencryptedPassword
//         })
//         .then(() =>
//           User
//           .findOne({username: 1234})
//         )
//         .then(user => {
//           console.log('user: ' + user);
//           expect(user).to.be.null;
//           // return true;
//         })
//     });

//     it('Should reject users with non-string password', () => {
//       return chai
//         .request(app)
//         .post('/signup')
//         .send({
//           username: testUserName,
//           password: 1234
//         })
//         .then(() =>
//           User
//           .findOne({username: testUserName})
//         )
//         .then(user => {
//           console.log('user: ' + user);
//           expect(user).to.be.null;
//           // return true;
//         })
//     });

//     it('Should reject users with non-trimmed username', () => {
//       return chai
//         .request(app)
//         .post('/signup')
//         .send({
//           username: testUserName2,
//           password: unencryptedPassword
//         })
//         .then(() =>
//           User
//           .findOne({username: testUserName})
//         )
//         .then(user => {
//           console.log('user: ' + user);
//           expect(user).to.be.null;
//           // return true;
//         })
//     });

//     it('Should reject users with empty username', () => {
//       return chai.request(app)
//         .post('/signup')
//         .send({
//           username: '',
//           password: unencryptedPassword
//         })
//         .then(() =>
//           User
//           .findOne({username: testUserName})
//         )
//         .then(user => {
//           console.log('user: ' + user);
//           expect(user).to.be.null;
//           // return true;
//         })
//     });

//     it('Should reject users with password less than ten characters', () => {
//       return chai.request(app)
//         .post('/signup')
//         .send({
//           username: testUserName,
//           password: '123456789'
//         })
//         .then(() =>
//           User
//           .findOne({username: testUserName})
//         )
//         .then(user => {
//           console.log('user: ' + user);
//           expect(user).to.be.null;
//           // return true;
//         })
//     });

//     it('Should reject users with password greater than 72 characters', () => {
//       return chai.request(app)
//         .post('/signup')
//         .send({
//           username: testUserName,
//           password: new Array(73).fill('x').join('')
//         })
//         .then(() =>
//           User
//           .findOne({username: testUserName})
//         )
//         .then(user => {
//           console.log('user: ' + user);
//           expect(user).to.be.null;
//           // return true;
//         })
//     });

//     it('Should reject users with username greater than 72 characters', () => {
//       return chai.request(app)
//         .post('/signup')
//         .send({
//           username: testUserNameLong,
//           password: '1234567890'
//         })
//         .then(() =>
//           User
//           .findOne({username: testUserNameLong})
//         )
//         .then(user => {
//           console.log('user: ' + user);
//           expect(user).to.be.null;
//           // return true;
//         })
//     });

// });  // describe('User signup & login')

