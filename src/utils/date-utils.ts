import { Logger } from '@/logger/logger';
import { AllureReporter } from '@/reporting/allure-reporter';

export class DateUtils {
    private static logger = Logger.getInstance();
    private static allureReporter = new AllureReporter();

    /**
     * Get current date
     */
    static getCurrentDate(): Date {
        this.logger.debug('Getting current date');
        this.allureReporter.addStep('Get current date');
        const date = new Date();
        this.logger.debug(`Current date: ${date.toISOString()}`);
        return date;
    }

    /**
     * Get current timestamp
     */
    static getCurrentTimestamp(): number {
        this.logger.debug('Getting current timestamp');
        this.allureReporter.addStep('Get current timestamp');
        const timestamp = Date.now();
        this.logger.debug(`Current timestamp: ${timestamp}`);
        return timestamp;
    }

    /**
     * Format date to string
     */
    static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
        this.logger.debug(`Formatting date: ${date.toISOString()} with format: ${format}`);
        this.allureReporter.addStep(`Format date with format: ${format}`);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

        let formattedDate = format
            .replace('YYYY', year.toString())
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds)
            .replace('SSS', milliseconds);

        this.logger.debug(`Formatted date: ${formattedDate}`);
        return formattedDate;
    }

    /**
     * Parse date from string
     */
    static parseDate(dateString: string, format?: string): Date {
        this.logger.debug(`Parsing date from string: ${dateString}`);
        this.allureReporter.addStep(`Parse date from string: ${dateString}`);

        let date: Date;

        try {
            if (format) {
                // Custom format parsing would go here
                // For now, use default parsing
                date = new Date(dateString);
            } else {
                date = new Date(dateString);
            }

            if (isNaN(date.getTime())) {
                throw new Error(`Invalid date string: ${dateString}`);
            }

            this.logger.debug(`Parsed date: ${date.toISOString()}`);
            return date;
        } catch (error) {
            this.logger.error(`Date parsing failed: ${error}`);
            this.allureReporter.addStep(`Date parsing failed: ${error}`);
            throw error;
        }
    }

    /**
     * Add days to date
     */
    static addDays(date: Date, days: number): Date {
        this.logger.debug(`Adding ${days} days to date: ${date.toISOString()}`);

        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);

        this.logger.debug(`New date: ${newDate.toISOString()}`);
        return newDate;
    }

    /**
     * Add hours to date
     */
    static addHours(date: Date, hours: number): Date {
        this.logger.debug(`Adding ${hours} hours to date: ${date.toISOString()}`);

        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() + hours);

        this.logger.debug(`New date: ${newDate.toISOString()}`);
        return newDate;
    }

    /**
   * Subtract days from date
   */
    static subtractDays(date: Date, days: number): Date {
        this.logger.debug(`Subtracting ${days} days from date: ${date.toISOString()}`);

        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - days);

        this.logger.debug(`New date: ${newDate.toISOString()}`);
        return newDate;
    }

    /**
     * Get difference between two dates in days
     */
    static getDaysDifference(date1: Date, date2: Date): number {
        this.logger.debug(`Getting days difference between ${date1.toISOString()} and ${date2.toISOString()}`);

        const timeDiff = Math.abs(date2.getTime() - date1.getTime());
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        this.logger.debug(`Days difference: ${daysDiff}`);
        return daysDiff;
    }


    /**
     * Generate timestamp for file names
     */
    static generateTimestampForFileName(): string {
        this.logger.debug('Generating timestamp for file name');

        const now = new Date();
        const timestamp = this.formatDate(now, 'YYYY-MM-DD_HH-mm-ss-SSS');

        this.logger.info(`Timestamp for file name: ${timestamp}`);
        return timestamp;
    }
}

