/* tslint:disable */
let expect = require('chai').expect;
let sinon = require('sinon');
LoggerFactory.initTestLogger();
/* tslint:enable */
import 'reflect-metadata';

import { LoggerFactory } from '../../../core/logging/logger.factory';

import { UserService } from '../service/user.service';
import { UserRegistrationRequest } from '../request/user.registration.request';

describe('User Service', () => {

    let userRepoMock: any;
    let authServiceMock: any;
    let loggerMock: any;

    let repoObj = {
        create: function(data: string) {
            console.log('just a stub');
        },
        findOne: function(data: string) {
            console.log('just a stub');
        }
    };

    let authObj = {
        createNotification: function() {
            console.log('just a stub');
        }
    };

    let loggerObj = {
        info: function(message: string) {
            console.log('just a stub');
        }
    };

    beforeEach(function() {
        userRepoMock = sinon.mock(repoObj);
        authServiceMock = sinon.mock(authObj);
        loggerMock = sinon.mock(loggerObj);
    });

    afterEach(function() {
        userRepoMock.restore();
        authServiceMock.restore();
        loggerMock.restore();
    });

    it('register succeeds @unit', async () => {
        let userRequest = new UserRegistrationRequest();
        userRequest.email = 'test@test.com';
        userRequest.firstName = 'testfirst';
        userRequest.lastName = 'testlast';
        userRequest.password = 't3stp4s5w0rd7357#!+';

        userRepoMock
            .expects('findOne')
            .withArgs({'email': 'test@test.com'})
            .once()
            .returns(null);

        userRepoMock
            .expects('create')
            .once()
            .returns(Promise.resolve(<any>{
                email: 'test@test.com'
            }));

        authServiceMock
            .expects('generatePasswordHash')
            .withArgs('t3stp4s5w0rd7357#!+')
            .once()
            .returns(Promise.resolve('hashedPassword'));

        authServiceMock
            .expects('getRandomString')
            .once()
            .returns(Promise.resolve('hashedEmail'));

        loggerMock
            .expects('info')
            .once();

        let userService = new UserService(userRepoMock.object, authServiceMock.object);
        let newUser = await userService.register(userRequest);

        userRepoMock.verify();
        authServiceMock.verify();

        expect(newUser.email).to.equal('test@test.com');
    });

});
