import { Logger } from '@/logger/logger';
import { AllureReporter } from './allure-reporter';
import { BaseReporter, TestResult, TestAttachment } from './base-reporter';

export class TestReporter extends BaseReporter {
    private allureReporter: AllureReporter;

    constructor() {
        super();
        this.allureReporter = new AllureReporter();
    }

    /**
     * Start test
     */
    override startTest(testId: string, testName: string, suiteName: string): void {
        super.startTest(testId, testName, suiteName);
        this.allureReporter.addTestSuite(suiteName);
        this.allureReporter.addTestLabel('test-id', testId);
        this.allureReporter.addTestLabel('test-name', testName);
    }

    /**
     * End test
     */
    override endTest(status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'BROKEN', error?: string): void {
        super.endTest(status, error);
        if (error) {
            this.allureReporter.addErrorDetails(new Error(error));
        }
    }

    /**
     * Add step to current test
     */
    addStep(stepName: string, stepDetails?: string): void {
        this.allureReporter.addStep(stepName, stepDetails);
    }

    /**
     * Add attachment to current test
     */
    override addAttachment(name: string, content: string | Buffer, type: string, filePath?: string): void {
        super.addAttachment(name, content, type, filePath);
        this.allureReporter.addAttachment(name, content, type);
    }

    /**
     * Add screenshot
     */
    async addScreenshot(name: string, screenshotPath: string): Promise<void> {
        this.logger.info(`REPORTER: Adding screenshot: ${name}`);
        await this.addAttachment(name, '', 'image/png', screenshotPath);
        await this.allureReporter.addScreenshot(name, screenshotPath);
    }

    /**
     * Add JSON data
     */
    addJSONData(name: string, data: any): void {
        this.logger.debug(`REPORTER: Adding JSON data: ${name}`);
        const jsonString = JSON.stringify(data, null, 2);
        this.addAttachment(name, jsonString, 'application/json');
    }

    /**
     * Add test data
     */
    addTestData(dataType: string, data: any): void {
        this.logger.debug(`REPORTER: Adding test data: ${dataType}`);
        this.addJSONData(`Test Data - ${dataType}`, data);
        this.allureReporter.addJSONAttachment(`Test Data - ${dataType}`, data);
    }

    /**
     * Add error details
     */
    addErrorDetails(error: Error): void {
        this.logger.error(`REPORTER: Adding error details: ${error.message}`);
        const errorData = {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        };
        this.addJSONData('Error Details', errorData);
        this.allureReporter.addErrorDetails(error);
    }

    /**
     * Add test configuration
     */
    addTestConfiguration(config: Record<string, any>): void {
        this.logger.debug(`REPORTER: Adding test configuration: ${Object.keys(config).join(', ')}`);
        this.addJSONData('Test Configuration', config);
    }

    /**
     * Get Allure reporter instance
     */
    getAllureReporter(): AllureReporter {
        return this.allureReporter;
    }
}