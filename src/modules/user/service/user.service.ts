import { inject, injectable} from 'inversify';

import { TYPES } from '../../../ioc/types';
import { LoggerFactory } from '../../../core/logging/logger.factory';
import { NotFoundException } from '../../../core/error/exception/notfound.exception';

import { UserMapper} from './../mapper/user.mapper';
import { UserRegistrationRequest} from '../request/user.registration.request';
import { UserRepository} from './../repository/user.repository';
import { IUserDBModel} from './../model/user.db.model';
import { UserState } from '../model/userstate.db.model';
import { UserConfirmationRequest } from '../request/user.confirmation.request';
import { ConfirmationError } from '../error/confirmation.exception';
import { RegistrationError } from '../error/registration.exception';
import { ForgetPasswordRequest } from '../request/user.forgetpassword.request';
import { ResetPasswordRequest } from '../request/user.resetpassword.request';
import { PasswordResetError } from '../error/password.reset.exception';
import { AuthService } from './authenticate.service';

const log = LoggerFactory.getLogger(__filename);

@injectable()
export class UserService {

    constructor(
        @inject(TYPES.UserRepository) private _userRepository: UserRepository,
        @inject(TYPES.AuthService) private _authService: AuthService
    ) {
    }

    public async register(userRequest: UserRegistrationRequest): Promise<IUserDBModel> {
        let userDocument = await this.mapRequestToDocument(userRequest);

        let existingUser = await this._userRepository.findOne({'email': userDocument.email});

        if (existingUser) {
            throw new RegistrationError('User already exists');
        }

        let result: IUserDBModel = await this._userRepository.create(userDocument);
        log.info(`User was created with ${result.toString()}`);
        return result;
    }

    public async confirm(confirmRequest: UserConfirmationRequest): Promise<IUserDBModel> {

        let existingUser: IUserDBModel = await this._userRepository.findOne({'emailHash': confirmRequest.id});

        if (!existingUser) {
            throw new ConfirmationError(`Email can't be activated`);
        }

        const update: IUserDBModel = {
            emailHash: undefined,
            emailSentOn: undefined,
            state: UserState.ACTIVE
        };

        await this._userRepository.update(<string>existingUser._id, update);
        log.info(`User was updated in confirmation process with ${existingUser.toString()}`);
        return existingUser;
    }

    public async forgetPassword(forgetRequest: ForgetPasswordRequest): Promise<IUserDBModel> {

        let existingUser: IUserDBModel = await this.getUserByEmail(forgetRequest.email);

        if (!existingUser || existingUser.state !== UserState.ACTIVE) {
            throw new NotFoundException(`User can't be or not activated found by email: ${forgetRequest.email}`);
        }

        const update: IUserDBModel = {
            passwordreset: await this._authService.getRandomString(20)
        };

        existingUser.passwordreset = update.passwordreset;

        await this._userRepository.update(<string>existingUser._id, update);
        log.info(`User was updated in forgetpassword process with ${existingUser.toString()}`);

        return existingUser;
    }

    public async resetPassword(resetRequest: ResetPasswordRequest): Promise<IUserDBModel> {

        if (resetRequest.password !== resetRequest.password2) {
            throw new PasswordResetError(`Passwords are not equal`);
        }

        let existingUser: IUserDBModel = await this._userRepository.findOne({'passwordreset': resetRequest.id});

        return this.doResetPassword(existingUser, resetRequest);
    }

    public async resetPasswordForUser(resetRequest: ResetPasswordRequest): Promise<IUserDBModel> {

        if (resetRequest.password !== resetRequest.password2) {
            throw new PasswordResetError(`Passwords are not equal`);
        }

        let existingUser: IUserDBModel = await this._userRepository.findById(<string>resetRequest.id);

        return this.doResetPassword(existingUser, resetRequest);
    }

    public async update(id: string, userToUpdate: IUserDBModel): Promise<IUserDBModel> {
        await this._userRepository.update(id, userToUpdate);

        const user = await this._userRepository.findById(id);

        return user;
    }

    public async getUserByEmail(email: string): Promise<IUserDBModel> {
        const user: IUserDBModel = await this._userRepository.findOne({'email': email});

        if (!user) {
            throw new NotFoundException(`User was not found by Email: ${email}`);
        }

        return user;
    }

    public async getUserById(id: string): Promise<IUserDBModel> {
        const user: IUserDBModel = await this._userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`User was not found by Id: ${id}`);
        }

        return user;
    }

    private async doResetPassword(existingUser: IUserDBModel,
                                  resetRequest: ResetPasswordRequest): Promise<IUserDBModel> {

        if (!existingUser || existingUser.state !== UserState.ACTIVE) {
            throw new PasswordResetError(`Password can't be reset with Hash: ${resetRequest.id}, 
                                          maybe user was never be activated`);
        }

        let passwordHash = await this._authService.generatePasswordHash(resetRequest.password);

        const update: IUserDBModel = {
            password: passwordHash,
            passwordreset: undefined,
        };

        await this._userRepository.update(<string>existingUser._id, update);
        log.info(`Password Reset was successful ${existingUser.toString()}`);
        return existingUser;
    }

    /**
     * Maps the registration request to the user document.
     * Poor man's mapper, manual mapped.
     * @param userRequest registration request
     * @returns {IUserDocument}
     */
    private async mapRequestToDocument(request: UserRegistrationRequest): Promise<IUserDBModel > {

        let mappedUser: IUserDBModel = UserMapper.mapUserRegistrationToDB(request);

        // hash password
        const passwordHash = await this._authService.generatePasswordHash(<string>mappedUser.password);

        mappedUser.password = passwordHash;
        mappedUser.state = UserState.PENDING;
        mappedUser.emailHash = await this._authService.getRandomString(20);
        return mappedUser;
    }
}
