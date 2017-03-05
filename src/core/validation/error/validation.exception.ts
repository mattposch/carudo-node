import {BaseException} from '../../error/exception/base.exception';

/**
 * Exception when an item is not found.
 */
export class ValidationException extends BaseException {
    /**
     * Ctor.
     * @param message Error message
     */
    constructor(message: string, error?: Error) {
        super(message);
        this.name = 'ValidationException';
        this.statusCode = 400;
    }
}
