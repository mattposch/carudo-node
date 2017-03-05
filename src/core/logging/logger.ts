import { ILogger } from './logger.interface';
import { LoggerFactory } from './logger.factory';

/**
 * Lightweigth wrapper over our singleton winston instance.
 */
export class Logger implements ILogger {
    /**
     * Ctor.
     * @param module Module to log.
     */
    constructor(private module: string) {
    }

    /**
     * Log in debug level.
     * @param msg   Message to log
     * @param meta  Metainfo to log
     */
    public debug(msg: string, ...meta: any[]): void {
        meta = this.handleMeta(meta);
        LoggerFactory.getInternalLogger().log('debug', `${msg}`, meta);
    }

    /**
     * Log in verbose level.
     * @param msg   Message to log
     * @param meta  Metainfo to log
     */
    public verbose(msg: string, ...meta: any[]): void {
        meta = this.handleMeta(meta);
        LoggerFactory.getInternalLogger().log('verbose', `${msg}`, meta);
    }

    /**
     * Log in info level.
     * @param msg   Message to log
     * @param meta  Metainfo to log
     */
    public info(msg: string, ...meta: any[]): void {
        meta = this.handleMeta(meta);
        LoggerFactory.getInternalLogger().log('info', `${msg}`, meta);
    }

    /**
     * Log in warn level.
     * @param msg   Message to log
     * @param meta  Metainfo to log
     */
    public warn(msg: string, ...meta: any[]): void {
        meta = this.handleMeta(meta);
        LoggerFactory.getInternalLogger().log('warn', `${msg}`, meta);
    }

    /**
     * Log in error level.
     * @param msg   Message to log
     * @param meta  Metainfo to log
     */
    public error(msg: string, ...meta: any[]): void {
        meta = this.handleMeta(meta);
        LoggerFactory.getInternalLogger().log('error', `${msg}`, meta);
    }

    private handleMeta(meta: any[]) {

        let newmeta: any;
        if (!meta) {
            newmeta = [];
        } else {
            newmeta = meta;
        }

        let modulename = this.buildModuleString();
        newmeta.push({module: modulename});
        return newmeta;
    }

    /**
     * Build the module string.
     * @returns {string}
     */
    private buildModuleString(): string {
        return `[${this.module}] `;
    }
}

