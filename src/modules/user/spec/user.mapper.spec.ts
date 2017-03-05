'use strict';

import {UserRegistrationRequest} from './../request/user.registration.request';
import {UserMapper} from '../mapper/user.mapper';

/* tslint:disable */
import chai = require('chai');
const expect = chai.expect;
/* tslint:enable */

// todo remove user mapper

describe('Mapping Tests', () => {

        let userRegistration: UserRegistrationRequest;

        beforeEach(() => {

            userRegistration = new UserRegistrationRequest();
            userRegistration.email = 'test@test.com';
            userRegistration.firstName = 'testfirst';
            userRegistration.lastName = 'testlast';
            userRegistration.password = 't3stp4s5w0rd7357#!+';

            /*dbUser = new UserDBModel({
                createdOn: '2013-02-04T10:35:24-08:00',
                email: 'dbtest@test.com',
                firstName: 'dbTest',
                id: '123',
                lastName: 'dbLTest',
                modifiedOn: '2016-02-04T10:35:24-08:00',
                password: '#1233kewrwerRTwewerOP',
                state: 'active'
            });*/
        });

        describe('Model Mapping Tests', () => {
            it('map registration to db model', () => {
                let user = UserMapper.mapUserRegistrationToDB(userRegistration);
                /*expect(user).to.be.an.instanceof(UserDBModel);*/
                expect(user.email).to.be.eq('test@test.com');
                expect(user.firstName).to.be.eq('testfirst');
                expect(user.lastName).to.be.eq('testlast');
                expect(user.password).to.be.eq('t3stp4s5w0rd7357#!+');
            });
        });
    });
