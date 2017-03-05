import * as express from 'express';
import { Controller, interfaces, Post, Get } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

import { MailService } from './../../../core/mail';
import { validateBody } from '../../../core/util';
import { ValidationException } from '../../../core/validation';
import { LoggerFactory } from '../../../core/logging';

import { TYPES } from './../../../ioc/types';

import { AuthService } from '../service/authenticate.service';
import { UserService } from './../service/user.service';
import { IJWTToken } from '../model/token.model';
import { UserRegistrationRequest } from '../request/user.registration.request';
import { UserConfirmationRequest } from '../request/user.confirmation.request';
import { ResetPasswordRequest } from '../request/user.resetpassword.request';
import { ForgetPasswordRequest } from '../request/user.forgetpassword.request';
import { AuthenticationError } from '../error/authentication.exception';
import { IUserDBModel } from '../model/user.db.model';
import { UserState } from '../model/userstate.db.model';

const log = LoggerFactory.getLogger(__filename);

// todo move logic to services

@Controller('/api/users')
@injectable()
export class UserController implements interfaces.Controller {

    constructor(
        @inject(UserService.name) private _userService: UserService,
        @inject(TYPES.MailService) private _mailService: MailService,
        @inject(TYPES.AuthService) private _authService: AuthService
    ) { }

    @Post('/login')
    public async login(request: express.Request/*, response: express.Response, next: any*/) {
        if (!request.body.email || !request.body.password) {
            throw new AuthenticationError('Error, Wrong Email / Password Combination ');
        }

        const email = request.body.email;
        const password = request.body.password;
        const user: IUserDBModel = await this._userService.getUserByEmail(email);

        if (!(await this._authService.checkPasswords(password, <string>user.password))) {
            throw new AuthenticationError('Error, wrong password');
        }

        if (user.state !== UserState.ACTIVE) {
            throw new AuthenticationError('Error, User is not activated');
        }

        const toUpdate = {
            loginAttempt: new Date(),
        };

        await this._userService.update(<string>user._id, toUpdate);

        return await this._authService.signIn(user);
    }

    @Get('/me')
    public async me(request: Request): Promise<any> {
        const extractedUser = await this._authService.extractToken(request);
        const userId = extractedUser._id;

        if (!userId) {
            throw 'no userId';
        }

        return this._userService.getUserById(userId);
    }

    @Post('/register')
    public async register(request: Request, response: Response): Promise<void> {
        try {
            // deserialize and validate the request
            const userRequest: UserRegistrationRequest =
                await validateBody<UserRegistrationRequest>(request, UserRegistrationRequest);

            // perform the registration
            const user = await this._userService.register(userRequest);

            try {
                let username = 'user';
                if (user && user.firstName && user.lastName) {
                    username = `${user.firstName} ${user.lastName}`;
                }
                await this._mailService.sendActivationMail(
                    username,
                    <string>user.email,
                    <string>user.emailHash
                );
            } catch (error) {
                log.error(`Error in Mailing: ${error}`);
            }

            response.sendStatus(201);
        } catch (error) {
            if (error instanceof MongoError) {
                throw new ValidationException(
                    'A user with the same mail and/or user id is already avaiable.', error);
            }
            throw error;
        }
    }

    @Post('/confirm')
    public async confirm(request: Request, response: Response): Promise<IJWTToken> {
        try {
            const confirmRequest: UserConfirmationRequest
                    = await validateBody<UserConfirmationRequest>(request, UserConfirmationRequest);

            const user = await this._userService.confirm(confirmRequest);

            const jwt = await this._authService.signIn(user);

            return jwt;

        } catch (error) {
            if (error instanceof MongoError) {
                throw new ValidationException(
                    'Confirmation update went wrong', error);
            }
            throw error;
        }
    }

    @Post('/reset')
    public async reset(request: Request, response: Response): Promise<IJWTToken> {
        try {
            const resetRequest: ResetPasswordRequest
                    = await validateBody<ResetPasswordRequest>(request, ResetPasswordRequest);

            const user = await this._userService.resetPassword(resetRequest);

            const jwt = await this._authService.signIn(user);

            return jwt;

        } catch (error) {
            if (error instanceof MongoError) {
                throw new ValidationException(
                    'Reset Password went wrong', error);
            }
            throw error;
        }
    }

    @Post('/forget')
    public async forget(request: Request, response: Response): Promise<void> {
        try {
            const forgetRequest: ForgetPasswordRequest
                    = await validateBody<ForgetPasswordRequest>(request, ForgetPasswordRequest);

            const user = await this._userService.forgetPassword(forgetRequest);

            let username = 'user';
            if (user && user.firstName && user.lastName) {
                username = `${user.firstName} ${user.lastName}`;
            }
            await this._mailService.sendForgetPasswordMail(`${username}`,
                                                    <string>user.email,
                                                    <string>user.passwordreset);
            response.sendStatus(200);
        } catch (error) {
            if (error instanceof MongoError) {
                throw new ValidationException(
                    'Forget Password update went wrong', error);
            }
            throw error;
        }
    }
}
