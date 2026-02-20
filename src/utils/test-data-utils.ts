import { Logger } from '@/logger/logger';
import { AllureReporter } from '@/reporting/allure-reporter';
import testDataJson from '@test-data/test-data.json';

/**
 * Test Data Utils - Handles reading test data from test-data.json
 */
export class TestDataUtils {
    private static logger = Logger.getInstance();
    private static allureReporter = new AllureReporter();

    /**
     * Get test data by key from test-data.json
     */
    static getTestData(key: string): any {
        this.logger.debug(`Getting test data for key: ${key}`);
        this.allureReporter.addStep(`Getting test data for key: ${key}`);

        if (!testDataJson[key as keyof typeof testDataJson]) {
            this.logger.error(`Test data not found for key: ${key}`);
            this.allureReporter.addStep(`Test data not found for key: ${key}`);
            throw new Error(`Test data not found for key: ${key}`);
        }

        const data = testDataJson[key as keyof typeof testDataJson];
        this.logger.debug(`Successfully retrieved test data for key: ${key}`);
        this.allureReporter.addStep(`Successfully retrieved test data for key: ${key}`);

        return data;
    }

    /**
     * Get all test data from test-data.json
     */
    static getAllTestData(): any {
        this.logger.debug('Getting all test data');
        this.allureReporter.addStep('Getting all test data');

        return testDataJson;
    }

    /**
     * Check if test data key exists in test-data.json
     */
    static hasTestDataKey(key: string): boolean {
        this.logger.debug(`Checking if test data key exists: ${key}`);
        this.allureReporter.addStep(`Checking if test data key exists: ${key}`);

        const exists = key in testDataJson;
        this.logger.debug(`Test data key '${key}' exists: ${exists}`);
        return exists;
    }

    /**
     * Get available test data keys from test-data.json
     */
    static getAvailableKeys(): string[] {
        this.logger.debug('Getting available test data keys');
        this.allureReporter.addStep('Getting available test data keys');

        const keys = Object.keys(testDataJson);
        this.logger.debug(`Available test data keys: ${keys.join(', ')}`);
        return keys;
    }
}