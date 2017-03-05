import { Request } from 'express';
import { injectable, inject } from 'inversify';

import { LoggerFactory } from '../../../core/logging/logger.factory';

import { AuthenticationError } from '../error/authentication.exception';
import { UserService } from './../../../modules/user/service/user.service';

const log = LoggerFactory.getLogger(__filename);

@injectable()
export class PassportMiddleware {

    constructor(
        @inject(UserService.name) private userService: UserService
    ) { }

    public jwtStrategy = async (request: Request, payload: any, done: any) => {

        try {
            if (!payload || !payload._id) {
                return done(new AuthenticationError(`User can't be found`));
            }

            const user = this.userService.getUserById(payload._id);
            request.user = user;
            return done(null, user);
        } catch (error) {
            log.error(`Something went wrong: ${error}`);
            throw error;
        }
    }

}

