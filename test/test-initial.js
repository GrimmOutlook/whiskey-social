const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

describe('GET endpoint', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

    it('should return a 200 status & HTML', function() {

      let res;
      return chai.request(app)
        .get('/')
        .then(function(_res) {
          res = _res;
          console.log(res.status);
          res.should.have.status(200);
          res.should.be.html;
          console.log(`Your status is ${res.status}.`);
          // return status();
        });

    });
});
