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

let failedMessage = {
    status: joi.number().valid(400).required(),
    data : {
        message : joi.string().required()
    }
};
let dataNotAvailableMessage = {
    status: joi.number().valid(200).required(),
    data : {}
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
};

let userLoginSchema = {
  status: joi.number().valid(200).required(),
    data: {
      isCorrect : joi.boolean().valid(true).required()
    }
};

let updatedUser = {
    status: joi.number().valid(200).required(),
    data: {
        name: joi.string().optional(),
        status: joi.string().valid("notVerified").optional(),
        username: joi.string().optional(),
        email: joi.string().email().optional(),
        created_at: joi.date().timestamp().optional()
    }
};

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
                joi.assert(res.body, userSchema);
            })
            .end(done);

    });
});

describe('when user login into his account with valid data', ()=>{
   it('should return a 200 Ok success message', (done)=> {
       let userLogin = {
           email : 'Dawn_Quitzon85@gmail.com',
           password: 'p@55w0rD'
       };
       request.post(`/api/user/login`)
           .send(userLogin)
           .expect('Content-Type', /json/)
           .expect(200)
           .expect(res => {
             joi.assert(res.body, userLoginSchema);
             console.log(`User is logged with this response => ${JSON.stringify(res.body)}`)
           })
           .end(done);
   });
});

describe('when the get request contains an non-existing Id', function () {
    it('should return a 400 bad request', function(done){
        let id = 0;
        request.get(`/api/user/${id}`)
            .send()
            .expect('Content-type', /json/)
            .expect(200)
            .expect(res => {
                joi.assert(res.body, dataNotAvailableMessage);
            })
            .end(done);
    });
});

describe('when the get request contains an non-existing username', function () {
    it('should return a 400 bad request', function(done){
        let id = 'oauIsBest';
        request.get(`/api/user/${id}`)
            .send()
            .expect('Content-type', /json/)
            .expect(200)
            .expect(res => {
                joi.assert(res.body, dataNotAvailableMessage);
            })
            .end(done);
    });
});

describe('when the update endpoint requested contains a non-existing id', function () {
    it('should return a 400 bad request', function(done){

        let updateBody = {
            name : faker.name.findName(),
            username: faker.internet.userName(),
            email: faker.internet.email()
        };

        let id = 0;

        request.put(`/api/user/${id}`)
            .send(updateBody)
            .expect('Content-type', /json/)
            .expect(400)
            .expect(res => {
                joi.assert(res.body, failedMessage);
            })
            .end(done);
    });
});

describe('when the request update body containing an invalid item', function () {
    it('should return a 400 bad request', function(done){

        let updateBody = {
            name : faker.internet.userName(),
            username: faker.name.findName(),
            email: faker.internet.userName()
        };

        let id = parseInt(Math.random()*14+3);

        request.put(`/api/user/${id}`)
            .send(updateBody)
            .expect('Content-type', /json/)
            .expect(400)
            .expect(res => {
                console.log(`Update Endpoint Error => ${JSON.stringify(res.body)}`);
                joi.assert(res.body, invalidSchema);
            })
            .end(done);
    });
});

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

describe('when the user is updated with a request body with id', ()=>{
    it('should return a response body containing updated user', (done)=>{
        let updateUser = {
            name : faker.name.findName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
        };
        let id = parseInt(Math.random()*14+3);
        request.put(`/api/user/${id}`)
            .send(updateUser)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
                joi.assert(res.body, updatedUser);
            })
            .end(done);


    });
});

describe('when a user is requested using a number id', ()=> {
    it('should return a 200 Ok status with the user body response', (done) => {
        let id = parseInt(Math.random()*14+3);
        request.get(`/api/user/${id}`)
            .send()
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
                joi.assert(res.body, userSchema);
            })
            .end(done);
    });
});

describe('when a user is requested using a get by username', ()=> {
    it('should return a 200 Ok status with the user  body response', (done) => {
        let id = 'Marlene19';
        request.get(`/api/user/${id}`)
            .send()
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
                console.log(`\n\nget by username error message => ${JSON.stringify(res.body)}\n\n`);
                joi.assert(res.body, userSchema);
            })
            .end(done);
    });
});

describe('when a user is to be deleted using a get by id', ()=> {
    it('should return a 200 Ok status with the user  body response', (done) => {
        let id = parseInt(Math.random()*14+3);
        request.delete(`/api/user/${id}`)
            .send()
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
                console.log(`delete error message => ${res.body}`);
                joi.assert(res.body, failedMessage);
            })
            .end(done);
    });
});