export const LOG_LEVEL = {
    ALL: 9,
    INFO: 3,
    WARN: 2,
    ERROR: 1,
    NONE: 0
};

// Default to logging everything
let log_level = LOG_LEVEL.ALL;


/**
 * @class 
 * @hideconstructor
 */
export class Logger {


    /**
     * @summary
     * Print something to the console as a message
     */
    static log(...items) {
        if (log_level >= LOG_LEVEL.INFO) {
            console.log.apply(this, items);
        }
    }


    /**
     * @summary
     * Print something to the console as an info message
     */
    static info(...items) {
        if (log_level >= LOG_LEVEL.INFO) {
            console.info.apply(this, items);
        }
    }


    /**
     * @summary
     * Print something to the console as a warning
     */
    static warn(...items) {
        if (log_level >= LOG_LEVEL.WARN) {
            console.warn.apply(this, items);
        }
    }


    /**
     * @summary
     * Print something to the console as an error
     */
    static error(...items) {
        if (log_level >= LOG_LEVEL.ERROR) {
            console.error.apply(this, items);
        }
    }


    /**
     * @summary
     * Sets the logging level
     */
    static setLogLevel(level) {
        log_level = level;
    }

}
