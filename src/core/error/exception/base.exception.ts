/**
 * Base class for custom exceptions.
 */
export abstract class BaseException extends Error {
    /** the status code which should be returned to the client */
    public statusCode: number;

    /**
     * Ctor.
     * @param message
     */
    constructor(message: string, error?: Error) {
        super();
        this.name = 'Exception';
        if (error) {
            this.message = `${message} & ErrorMsg: ${error.message}`;
        } else {
            this.message = message;
        }
        this.stack = this.toString() + ' ' + (<any> new Error()).stack;
        this.statusCode = 500;
    }

    /**
     * Custom toString to provide the exception name.
     * @returns {string}
     */
    public toString(): string {
        return `${this.name}: ${this.message}`;
    }
}
