import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

export class Logger {
    private logger: winston.Logger;
    private static instance: Logger;

    constructor() {
        this.logger = this.createLogger();
    }

    /**
     * Create Winston logger instance with file transports only
     */
    private createLogger(): winston.Logger {
        // Ensure logs directory exists
        this.ensureLogsDirectory();

        const logFormat = winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss.SSS'
            }),
            winston.format.errors({ stack: true }),
            winston.format.printf(({ timestamp, level, message, stack, ...meta }: any) => {
                let logMessage = `${timestamp} [${level.toUpperCase()}] ${message}`;

                if (Object.keys(meta).length > 0) {
                    logMessage += ` ${JSON.stringify(meta)}`;
                }

                if (stack) {
                    logMessage += `\n${stack}`;
                }

                return logMessage;
            })
        );

        // File transports for all logs
        const transports: winston.transport[] = [
            new winston.transports.File({
                filename: path.join('logs', 'app.log'),
                level: 'info',
                format: logFormat,
                maxsize: 10 * 1024 * 1024, // 10MB
                maxFiles: 5,
                tailable: true
            })
        ];

        return winston.createLogger({
            level: 'info',
            format: logFormat,
            transports,
            exitOnError: false
        });
    }

    /**
     * Ensure logs directory exists
     */
    private ensureLogsDirectory(): void {
        const logsDir = 'logs';
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    }

    /**
     * Get singleton instance
     */
    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    /**
     * Log debug message
     */
    debug(message: string, meta?: any): void {
        this.logger.debug(message, meta);
    }

    /**
     * Log info message
     */
    info(message: string, meta?: any): void {
        this.logger.info(message, meta);
    }

    /**
     * Log warning message
     */
    warn(message: string, meta?: any): void {
        this.logger.warn(message, meta);
    }

    /**
     * Log error message
     */
    error(message: string, meta?: any): void {
        this.logger.error(message, meta);
    }

    /**
     * Log test pass
     */
    pass(message: string, meta?: any): void {
        this.logger.info(`[PASS] ${message}`, meta);
    }

    /**
     * Log test fail
     */
    fail(message: string, meta?: any): void {
        this.logger.error(`[FAIL] ${message}`, meta);
    }

    /**
     * Close logger
     */
    close(): void {
        this.logger.close();
    }
}