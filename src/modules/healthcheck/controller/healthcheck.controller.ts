import * as express from 'express';
import { injectable } from 'inversify';
import { interfaces, Controller, Get } from 'inversify-express-utils';

/**
 * Health check controller.
 */
@Controller('/api/healthcheck')
@injectable()
export class HealthCheckController implements interfaces.Controller {

    @Get('/')
    public index(request: express.Request): string {
        return 'OK';
    }

}
