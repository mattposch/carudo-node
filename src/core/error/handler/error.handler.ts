import {NextFunction, Request, Response} from 'express';

import {config} from '../../config/config';
import {LoggerFactory} from '../../logging/logger.factory';

const log = LoggerFactory.getLogger(__filename);

/**
 * Simple express error handler.
 * @param error     encountered error
 * @param request   request object
 * @param response  resposne object
 * @param next      next handler in chain
 */
export function errorHandler(error: Error,
                             request: Request,
                             response: Response,
                             next: NextFunction) {
    // if the headers are already sent, give control to the standard error handler
    if (response.headersSent) {
        return next(error);
    }

    // log error
    if (error.stack != null) {
        log.error(error.stack);
    }

    // send json error
    if (config.environment.isDev) {
        response
            .set('Content-Type', 'application/json')
            .status(500)
            .send(JSON.stringify({
                'message':  error.message,
                'name':     error.name
            }));
    } else {
        response.sendStatus(500);
    }
}
