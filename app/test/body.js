'use strict';

let app = require('../../server');
let request = require('supertest')(app);
let joi = require('joi');
let faker = require('faker');

let invalidSchema = {
    status: joi.number().valid(400).required(),
    data: {
        message: {
            status: joi.number().integer().required(),
            statusText: joi.string().valid('Bad Request').required(),
            errors: joi.array().required().items(
                joi.object().required().keys({
                    field: joi.string().required(),
                    location: joi.string().required(),
                    messages: joi.array().required().items(joi.string().optional()),
                    types: joi.array().required().items(joi.string().optional())
                })
            )
        }
    }
};

let userSchema = {
    status: joi.number().valid(200).required(),
    data: {
        name: joi.string().required(),
        status: joi.string().valid("notVerified").optional(),
        username: joi.string().required(),
        email: joi.string().email().required(),
        created_at: joi.date().timestamp().optional()
    }
}


describe('when the request has a missing item in create user payload', function () {
  it('should return a 400 ok response and a single error', function(done){

    let login = {
        email: "andrew.keig@gmail.com"
    };

    request.post('/api/user/')
      .send(login)
      .expect('Content-type', /json/)
      .expect(400)
      .expect(res => {
         joi.assert(res.body, invalidSchema);
      })
      .end(done);
    });
});

describe('when the request body wants to create a new user', function () {
    it('should return a 200 ok response and the new user', (done) => {
        let newUser = {
            name : faker.name.findName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: 'p@55w0rD'
        };
        console.log(JSON.stringify(newUser));
        request.post('/api/user/')
            .send(newUser)
            .expect('Content-type', /json/)
            .expect(200)
            .expect(res => {
                console.log(JSON.stringify(res.body));
                joi.assert(res.body, userSchema);
            })
            .end(done);

    })
})
