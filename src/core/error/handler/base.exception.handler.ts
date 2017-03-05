import {NextFunction, Request, Response} from 'express';

import {LoggerFactory} from '../../logging/logger.factory';
import {BaseException} from '../exception/base.exception';

const log = LoggerFactory.getLogger(__filename);

/**
 * Error handler for our custom exceptions.
 * @param error     encountered error
 * @param request   request object
 * @param response  resposne object
 * @param next      next handler in chain
 */
export function baseExceptionErrorHandler(error: Error,
                             request: Request,
                             response: Response,
                             next: NextFunction) {
    // if the headers are already sent, give control to the standard error handler
    if (response.headersSent) {
        return next(error);
    }

    // delegate all errors which are not of type BaseException
    if (!(error instanceof BaseException)) {
        return next(error);
    }

    // return excpetion status code
    const exception: BaseException = error;
    log.warn(exception.toString());
    response.send(exception.statusCode, exception);
}
