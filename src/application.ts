import 'reflect-metadata';
import { Request } from 'express';
import { Core } from 'iridium';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as passport from 'passport';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as path from 'path';
import * as passportJWT from 'passport-jwt';

/* tslint:disable */
const expressWinston = require('express-winston');
const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
/* tslint:enable */

import { PassportMiddleware } from './modules/user/middleware/passport.middleware';
import { baseExceptionErrorHandler } from './core/error/handler/base.exception.handler';
import { Database } from './core/database/database';
import { errorHandler } from './core/error/handler/error.handler';
import { LoggerFactory } from './core/logging/logger.factory';
import { config } from './core/config/config';
import { kernel } from './ioc/bootstrap';
import { TYPES } from './ioc/types';

export class Application {

    /** logger instance */
    private readonly log = LoggerFactory.getLogger(__filename);

    /** Express server */
    private expressServer: express.Application;

    /**
     * Connects to MongoDB and sets up (not starting) the server.
     * @returns {express.Application}
     */
    public async init(): Promise<express.Application> {
        try {
            await this.connectToMongo();
            return this.setupServer();
        } catch (ex) {
            console.error('Error while starting the server! ' + ex);
            console.error(ex.stack);
            throw ex;
        }
    }

    /**
     * Starts the server.
     */
    public run(): void {
        let port = config.server.port;
        this.expressServer
            .listen(port, () => {
                this.log.debug(`Running under node version ${process.version}`);
                this.log.debug(`Express server listening on port ${port}`);
            });
    }

    /**
     * Returns the internal express application.
     * @returns {express.Application}
     */
    public getExpressServer(): express.Application {
        return this.expressServer;
    }

    /**
     * Frees all ressources to allow express to shutdown.
     * @returns {Promise<Core>} Iridium MongoDB core
     */
    public async prepareShutdown(): Promise<Core> {
        let database = <Database> kernel.get(TYPES.Database);
        return Promise.resolve(database.close());
    }

    /**
     * Connect to MongoDB.
     * @returns {Promise<Core>} Iridium MongoDB core
     */
    private async connectToMongo(): Promise<Core> {
        let database = <Database> kernel.get(TYPES.Database);
        return Promise.resolve(database.connect());
    }

    /**
     * Sets up the express server.
     * @returns {Promise<InversifyExpressServer>} The server
     */
    private setupServer(): express.Application {
        let server = new InversifyExpressServer(kernel);
        this.expressServer = server
            .setConfig((app: express.Application) => {
                this.setupStandardMiddleware(app);
            })
            .setErrorConfig((app: express.Application) => {
                this.setupErrorMiddleware(app);
            })
            .build();

            this.initializePassport();

            return this.expressServer;
    }

    private initializePassport() {

        let params: any = {
            jwtFromRequest: ExtractJWT.fromAuthHeader(),
            passReqToCallback: true,
            secretOrKey: config.token.security,
        };

        let passportManagement = kernel.get<PassportMiddleware>(TYPES.PassportMiddleware);

        passport.use(new Strategy(params,
            async function(request: Request, payload: any, done: any) {
                await passportManagement.jwtStrategy(request, payload, done);
            }
        ));

        this.expressServer.use(passport.initialize());
    }

    /**
     * Config server middleware.
     * @param app Express application
     */
    private setupStandardMiddleware(app: express.Application): void {
        // trust proxy
        app.set('trust proxy', 'loopback');

        // heroku doesn't compress, so compression must be part of the application
        app.use(compression());

        // enrich request body with parsed fields
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(cors());

        // helmet for security headers and checks
        app.use(helmet());

        // add request/response logging
        app.use(morgan('short', {
            stream: LoggerFactory.getMorganStreamAdapter(this.log)
        }));

        app.use(expressWinston.logger({
            level: 'info',
            winstonInstance: LoggerFactory.getInternalLogger()
        }));

        // passport middleware
        app.use(passport.initialize());
        app.use(passport.session()); // persistent login sessions

        // and finally static file serving
        const staticDir = path.normalize(__dirname + '/../public');
        this.log.debug(`Serving static files from directory '${staticDir}'`);
        app.use(express.static(staticDir));
    }

    /**
     * Config server error middleware.
     * @param app Express application
     */
    private setupErrorMiddleware(app: express.Application): void {
        app.use(baseExceptionErrorHandler);
        app.use(errorHandler);
    }
}


