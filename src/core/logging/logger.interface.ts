/**
 * Logger interface.
 * The functions are sorted after the severity.
 */
export interface ILogger {
    /**
     * Log in debug level.
     * @param msg   Message to log
     * @param meta  Metainfo to log
     */
    debug(msg: string, ...meta: any[]): void;

    /**
     * Log in verbose level.
     * @param msg   Message to log
     * @param meta  Metainfo to log
     */
    verbose(msg: string, ...meta: any[]): void;

    /**
     * Log in info level.
     * @param msg   Message to log
     * @param meta  Metainfo to log
     */
    info(msg: string, ...meta: any[]): void;

    /**
     * Log in warn level.
     * @param msg   Message to log
     * @param meta  Metainfo to log
     */
    warn(msg: string, ...meta: any[]): void;

    /**
     * Log in error level.
     * @param msg   Message to log
     * @param meta  Metainfo to log
     */
    error(msg: string, ...meta: any[]): void;
}
