import {BaseException} from '../../../core/error/exception/base.exception';

export class RegistrationError extends BaseException {
    constructor(message: string, error?: Error) {
        super(message, error);
        this.statusCode = 403;
    }
}
