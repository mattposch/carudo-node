import {BaseException} from './base.exception';

/**
 * Exception when an item is not found.
 */
export class NotFoundException extends BaseException {
    /**
     * Ctor.
     * @param message Error message
     */
    constructor(message: string, error?: Error) {
        super(message, error);
        this.name = 'NotFoundException';
        this.statusCode = 404;
    }
}
