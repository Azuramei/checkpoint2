import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import isEmpty from 'lodash/isEmpty';
import app from '../server';
import token from './helpers/token.json';

const User = require('../models').User;
// const Document = require('../models').Document;
const Role = require('../models').Role;

const request = supertest.agent(app);
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('API Routes', () => {
  describe('Users endpoints', () => {
    beforeEach((done) => {
      User.destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true
      })
      .then((err) => {
        if (!err) {
          Role.destroy({
            where: {},
            truncate: true,
            cascade: true,
            restartIdentity: true
          })
          .then((err) => {
            if (!err) {
              Role.create({
                name: 'Admin',
                description: 'This is the Admin role'
              }).then((err) => {
                if (!err) {
                  //
                }
                done();
              });
            }
          });
        }
      });
    });

    /**
     * Test the GET /api/users route
     */
    describe('GET /api/users', () => {
      beforeEach((done) => {
        User.create({
          username: 'boluwatifemi',
          fullname: 'Bingo',
          password: '123456',
          email: 'greatbolutife@gmail.com',
          roleId: 1
        }).then((err) => {
          if (!err) {
            //
          }
          done();
        });
      });
      it('connects to the api', (done) => {
        request
        .get('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', token.admin)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
          }
          done();
        });
      });

      it('returns data', (done) => {
        request
        .get('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', token.admin)
        .end((err, res) => {
          if (!err) {
            expect(res.body.users).to.be.an('array');
          }
          done();
        });
      });
    });

    /**
     * Test the POST /api/users route
     */
    describe('POST /api/users', () => {
      beforeEach((done) => {
        User.create({
          username: 'boluwatifemi',
          fullname: 'Bingo',
          password: '123456',
          passwordConfirmation: '123456',
          email: 'greatbolutife@gmail.com',
          roleId: 1
        }).then((err) => {
          if (!err) {
            //
          }
          done();
        });
      });
      it('it should not POST a user without the required fields', (done) => {
        const user = {
          username: '',
          fullname: '',
          password: '',
          email: 'greatbolutife@gmail.com',
        };
        request
        .post('/api/users')
        .set('Authorization', token.admin)
        .send(user)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(isEmpty(res.body)).to.equal(false);
            expect(res.body.username).to.equal('Username is required');
            expect(res.body.fullname).to.equal('Fullname is required');
            expect(res.body.password).to.equal('Password is required');
            expect(res.body).to.not.have.property('email');
          }
          done();
        });
      });

      it('should return error for duplicate user', (done) => {
        const user = {
          username: 'boluwatifemi',
          fullname: 'Bingo',
          password: '123456',
          passwordConfirmation: '123456',
          email: 'greatbolutife@gmail.com',
          roleId: 1
        };

        request
        .post('/api/users/')
        .set('Authorization', token.admin)
        .send(user)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to
            .equal('Username and email must be unique');
          }
          done();
        });
      });

      it('should POST a valid user', (done) => {
        const user = {
          username: 'db',
          fullname: 'Bamidele Daniel',
          password: '123456',
          passwordConfirmation: '123456',
          email: 'greatbol@gmail.com',
          roleId: 1
        };
        request
        .post('/api/users')
        .set('Authorization', token.admin)
        .send(user)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(201);
          }
          done();
        });
      });
    });

    /**
     * Test the GET /api/users/{id} route
     */
    describe('GET /api/users/:id', () => {
      beforeEach((done) => {
        User.create({
          username: 'boluwatifemi',
          fullname: 'Bingo',
          password: '123456',
          email: 'greatbolutife@gmail.com',
          roleId: 1
        }).then((err) => {
          if (!err) {
            //
          }
          done();
        });
      });
      it('should get a user by id', (done) => {
        request
        .get('/api/users/1/')
        .set('Authorization', token.admin)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.user.id).to.equal(1);
            expect(res.body.user.username).to.equal('boluwatifemi');
            expect(res.body.user.fullname).to.equal('Bingo');
            expect(res.body.user.email).to.equal('greatbolutife@gmail.com');
          }
          done();
        });
      });

      it('should return status 404 if user is not found', (done) => {
        request
        .get('/api/users/10')
        .set('Authorization', token.admin)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('User not found');
          }
          done();
        });
      });

      it('should return error if the userid is not a number', (done) => {
        request
        .get('/api/users/ade')
        .set('Authorization', token.admin)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Input must be digit');
          }
          done();
        });
      });
    });

    /**
     * Test PUT /api/users/{id} route
     */
    describe('PUT /api/users/:id', () => {
      beforeEach((done) => {
        User.create({
          username: 'boluwatifemi',
          fullname: 'Bingo',
          password: '123456',
          email: 'greatbolutife@gmail.com',
          roleId: 1
        }).then((err) => {
          if (!err) {
            //
          }
          done();
        });
      });
      it('return error if the userid is not a number', (done) => {
        request
        .put('/api/users/ade')
        .set('Authorization', token.admin)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Input must be digit');
          }
          done();
        });
      });

      it('return error if the user is not found', (done) => {
        request
        .put('/api/users/10')
        .set('Authorization', token.admin)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('User not found');
          }
          done();
        });
      });

      it('edits users', (done) => {
        request
        .put('/api/users/1/')
        .set('Authorization', token.admin)
        .send({
          fullname: 'Ibukunoluwa',
        })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
          }
          done();
        });
      });
    });

    /**
     * Test for DELETE /api/users/
     */
    describe('DELETE /api/users/id', () => {
      beforeEach((done) => {
        User.create({
          username: 'boluwatifemi',
          fullname: 'Bingo',
          password: '123456',
          email: 'greatbolutife@gmail.com',
          roleId: 1
        }).then((err) => {
          if (!err) {
            //
          }
          done();
        });
      });
      it('return error if the userid is not a number', (done) => {
        request
        .delete('/api/users/ade')
        .set('Authorization', token.admin)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Input must be digit');
          }
          done();
        });
      });

      it('deletes user by id', (done) => {
        request
        .delete('/api/users/1')
        .set('Authorization', token.admin)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('User deleted successfully');
          }
          done();
        });
      });
    });
  });
});

