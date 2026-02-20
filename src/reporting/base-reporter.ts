import { Logger } from '@/logger/logger';

export interface TestResult {
    testId: string;
    testName: string;
    suite: string;
    status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'BROKEN';
    startTime: number;
    endTime: number;
    duration: number;
    error?: string | undefined;
}

export interface TestAttachment {
    name: string;
    type: string;
    content: string | Buffer;
    filePath?: string;
}

export abstract class BaseReporter {
    protected logger: Logger;
    protected currentTest: TestResult | null = null;

    constructor() {
        this.logger = Logger.getInstance();
    }

    /**
     * Start test
     */
    startTest(testId: string, testName: string, suiteName: string): void {
        this.currentTest = {
            testId,
            testName,
            suite: suiteName,
            status: 'PASSED',
            startTime: Date.now(),
            endTime: 0,
            duration: 0
        };
        this.logger.info(`Test started: ${testName}`);
    }

    /**
     * End test
     */
    endTest(status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'BROKEN', error?: string): void {
        if (!this.currentTest) return;

        this.currentTest.endTime = Date.now();
        this.currentTest.duration = this.currentTest.endTime - this.currentTest.startTime;
        this.currentTest.status = status;
        this.currentTest.error = error || undefined;

        this.logger.info(`Test ended: ${this.currentTest.testName} - Status: ${status}`);
        this.currentTest = null;
    }

    /**
     * Add attachment to current test
     */
    addAttachment(name: string, content: string | Buffer, type: string, filePath?: string): void {
        this.logger.debug(`Attachment added: ${name} (${type})`);
        if (filePath) {
            this.logger.debug(`File path: ${filePath}`);
        }
    }

    /**
     * Get current test
     */
    getCurrentTest(): TestResult | null {
        return this.currentTest;
    }
}