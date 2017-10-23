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

// const {app, runServer, closeServer} = require('../server');
// const {TEST_DATABASE_URL} = require('../config/database');

// mongoose.Promise = global.Promise;   // Necessary?

// chai.use(chaiHttp);

// Database seeding fxns.:
// Seed a User with just username & hashed password - for use with tests where inserting a whiskey post for 1st time + authentication/authorization.
// function seedUser() {
//   const userAndPass = generateUser();
//   console.log('seedUser fxn. userAndPass: ', userAndPass);
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
//   console.log('fullUser: ', fullUser));
//   return User.create(fullUser);
// }

// Seed whiskey DB with many whiskeys


// Generate fake user:
// function generateUser() {
//   return {
//     testUsername: faker.name.firstName(),
//     unencryptedPassword: faker.internet.password()
//   };
// }

// Tear down DB after each test:
// function tearDownDb() {
//   console.warn('Deleting database');
//   return mongoose.connection.dropDatabase();
// }


// describe('POST stuff ', function() {
//   this.timeout(8000);

//   const username = faker.name.firstName();
//   const password = faker.internet.password();
//   const hashPassword = User.generateHash(password);  //why isn't User.generateHash() a fxn.?

//   before(() => runServer(TEST_DATABASE_URL));
//   // beforeEach(() => seedUser());
//   beforeEach(function() {
//     return
//     // User.generateHash(password).then(password =>
//             User.create({
//                 username: username,
//                 password: hashPassword
//             });
//         // );
//   });
//   // afterEach(() => tearDownDb());
//   after(() => closeServer());

//   describe('Just get a database user seeded', function() {
//     it('Just console.log something', function() {
//       return chai
//         .request(app)
//         .post('/')

//       console.log('username inside it: ' + username);
//       console.log('password inside it: ' + password);
//     })
//   })


// });  // describe()
