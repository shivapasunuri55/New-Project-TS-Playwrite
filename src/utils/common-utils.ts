import { Page, expect } from '@playwright/test';
import { Logger } from '@/logger/logger';
import { AllureReporter } from '@/reporting/allure-reporter';
// import { CoreUtils } from '../core-utils'; // Commented out as it's not being used

export class CommonUtils {
    private static logger = Logger.getInstance();
    private static allureReporter = new AllureReporter();


    /**
     * Generate random alphanumeric string of given length
     */
    static generateRandomString(length: number): string {
        this.logger.debug(`Generating random string of length: ${length}`);
        this.allureReporter.addStep(`Generate random string of length: ${length}`);

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        this.logger.debug(`Generated random string: ${result}`);
        return result;
    }

    /**
     * Generate random numeric string (first digit never zero)
     */
    static generateRandomNumber(count: number): string {
        this.logger.debug(`Generating random number of ${count} digits`);
        this.allureReporter.addStep(`Generate random number of ${count} digits`);

        if (count <= 0) {
            this.logger.warn('Count must be greater than 0');
            return '';
        }

        // First digit (1-9)
        let result = Math.floor(Math.random() * 9) + 1;

        // Remaining digits (0-9)
        for (let i = 1; i < count; i++) {
            result += Math.floor(Math.random() * 10);
        }

        const numberString = result.toString();
        this.logger.debug(`Generated random number: ${numberString}`);
        return numberString;
    }

    /**
     * Pick a random element from a list
     */
    static getRandomValueFromList<T>(list: T[]): T {
        this.logger.debug(`Getting random value from list of ${list.length} items`);
        this.allureReporter.addStep(`Get random value from list`);

        if (!list || list.length === 0) {
            const error = 'List is empty or invalid';
            this.logger.error(error);
            throw new Error(error);
        }

        const randomIndex = Math.floor(Math.random() * list.length);
        const selectedValue = list[randomIndex];

        if (selectedValue === undefined) {
            const error = 'Selected value is undefined';
            this.logger.error(error);
            throw new Error(error);
        }

        this.logger.debug(`Selected random value: ${selectedValue}`);
        return selectedValue;
    }

    // ==================== STATIC METHODS ====================

    /**
     * Another implementation for random alphanumeric string
     */
    static generateRandomAlphanumericString(length: number): string {
        this.logger.debug(`Generating random alphanumeric string of length: ${length}`);
        this.allureReporter.addStep(`Generate random alphanumeric string of length: ${length}`);

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        this.logger.debug(`Generated random alphanumeric string: ${result}`);
        return result;
    }

    /**
     * Generate random numeric string of given length
     */
    static generateRandomNumeric(length: number): string {
        this.logger.debug(`Generating random numeric string of length: ${length}`);
        this.allureReporter.addStep(`Generate random numeric string of length: ${length}`);

        if (length <= 0) {
            this.logger.warn('Length must be greater than 0');
            return '';
        }

        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }

        this.logger.debug(`Generated random numeric string: ${result}`);
        return result;
    }

    /**
     * Get random element from array (alias for getRandomValueFromList)
     */
    static getRandomElement<T>(list: T[]): T {
        return this.getRandomValueFromList(list);
    }

    /**
     * Generate random number between min and max (inclusive)
     */
    static randomNumber(min: number, max: number): number {
        this.logger.debug(`Generating random number between ${min} and ${max}`);
        this.allureReporter.addStep(`Generate random number between ${min} and ${max}`);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

