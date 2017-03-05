/* tslint:disable */
require('winston-loggly-bulk');
/* tslint:enable */

import * as winston from 'winston';

import { config } from '../config/config';
import { ILogger } from './logger.interface';
import { Logger } from './logger';

/**
 * Inits and construct lightweighted loggers.
 * Implements the ServiceLocator Pattern.
 */
export class LoggerFactory {
    /**
     * Our one and only single instance of the heavyweighted winston logger.
     * Initialized with the winston default logger. Therefore the logging output
     * changes after the initialization is performed.
     */
    private static logger: winston.LoggerInstance = winston.default;

    /** Watcher for multiple initialisations */
    private static isInitialized: boolean = false;

    /**
     * The root dir of the node application. This is used to log only the relative path
     * and must be initialized prior each logger creation.
     */
    private static rootDir: string = '';

    /**
     * Getter for the heavyweighted winston logger. Only for internal use
     * (to optimize memory consumption of the lightweighted logger instances).
     * @returns {LoggerInstance}
     */
    public static getInternalLogger(): winston.LoggerInstance {
        return LoggerFactory.logger;
    }

    /**
     * Initializes the logger.
     * @param rootDir       Application root directory
     */
    public static initLogger(rootDir?: string) {
        if (rootDir) {
            LoggerFactory.setRootDir(rootDir);
        }

        // shield against multiple calls
        if (LoggerFactory.isInitialized) {
            throw new Error('LoggerFactory must only initalized once.');
        }
        LoggerFactory.isInitialized = true;

        // create our logger
        LoggerFactory.logger = new (winston.Logger)({
            emitErrs:       false,
            exitOnError:    false,
            level:          config.logging.level,
            transports: [
                new winston.transports.Console({
                    colorize:       true,
                    level:          'debug',
                    prettyPrint:    true,
                    silent:         false,
                    timestamp:      true
                })
            ]
        });

        if (config.logging.loggly && config.logging.loggly.enabled) {
            LoggerFactory.logger.add(winston.transports.Loggly, config.logging.loggly.options);
        }
    }

    public static initTestLogger() {
        // shield against multiple calls
        if (LoggerFactory.isInitialized) {
            throw new Error('LoggerFactory must only ininitalized once.');
        }
        LoggerFactory.isInitialized = true;

        // create our logger
        LoggerFactory.logger = new (winston.Logger)({
            emitErrs:       false,
            exitOnError:    false,
            level:          config.logging.level,
            transports: [
                new winston.transports.Console({
                    colorize:       true,
                    level:          'debug',
                    prettyPrint:    true,
                    silent:         false,
                    timestamp:      true
                })
            ]
        });
    }

    /**
     * Sets the root directory explicitly (used to strip it off).
     * @param rootDir Root directory
     */
    public static setRootDir(rootDir: string): void {
        LoggerFactory.rootDir = rootDir + '/';
    }

    /**
     * Creates a lightweighted logger instance.
     * @param modulePath    Path of the module to log
     * @returns {ILogger}
     */
    public static getLogger(modulePath: string): ILogger {
        return new Logger(modulePath.replace(LoggerFactory.rootDir, ''));
    }

    /**
     * Creates an adapter for Morgan logging.
     * This is used for routing all Morgan logs over Winston.
     * @param log The logger used for routing.
     * @returns {{write: ((message:any, encoding:any)=>undefined)}}
     */
    public static getMorganStreamAdapter(log: ILogger): any {
        return {
            write: function (message: string, encoding: string) {
                log.debug(message.slice(0, -1));
            }
        };
    }

    /** Private constructor to prevent construction. */
    private constructor() {
        // empty constructor
    }
}
