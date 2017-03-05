import {BaseException} from '../../../core/error/exception/base.exception';

export class AuthenticationError extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
    }
}
