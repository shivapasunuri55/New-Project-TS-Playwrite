import { test as base, expect } from '@playwright/test';
import { TestBase } from '@test-base/testBase';
import { Logger } from '@/logger/logger';
import { AllureReporter } from '@/reporting/allure-reporter';
import { config } from '@config/env';

// Extend the base test with custom fixtures
export interface TestFixtures {
    testBase: TestBase;
    logger: Logger;
    allureReporter: AllureReporter;
}

export const test = base.extend<TestFixtures>({
    // TestBase fixture
    testBase: async ({ page, context, browser }, use) => {
        const testBase = new TestBase();
        testBase.initializeForTest(page, context, browser);
        await use(testBase);
    },

    // Logger fixture
    logger: async ({ }, use) => {
        const logger = new Logger();
        await use(logger);
    },

    // AllureReporter fixture
    allureReporter: async ({ }, use) => {
        const allureReporter = new AllureReporter();
        await use(allureReporter);
    },
});

// Custom expect with additional matchers
export { expect } from '@playwright/test';

// Test hooks
test.beforeEach(async ({ page, logger, allureReporter }) => {
    // Set default timeout
    page.setDefaultTimeout(config.timeouts.default);
    page.setDefaultNavigationTimeout(config.timeouts.long);

    // Set viewport
    await page.setViewportSize({
        width: config.viewport.width,
        height: config.viewport.height,
    });

    // Log test start
    const testName = test.info().title;
    logger.info(`Starting test: ${testName}`);
    allureReporter.addStep(`Test started: ${testName}`);
});

test.afterEach(async ({ page, logger, allureReporter }) => {
    const testName = test.info().title;
    const testResult = test.info().status;

    // Log test result
    if (testResult === 'passed') {
        logger.pass(`Test passed: ${testName}`);
        allureReporter.addStep(`Test passed: ${testName}`);
    } else if (testResult === 'failed') {
        logger.fail(`Test failed: ${testName}`);
        allureReporter.addStep(`Test failed: ${testName}`);

        // Take screenshot on failure
        const screenshotName = `failure_${Date.now()}`;
        await page.screenshot({
            path: `reports/screenshots/${screenshotName}.png`,
            fullPage: true
        });
        allureReporter.addAttachment(
            `Screenshot - ${screenshotName}`,
            `reports/screenshots/${screenshotName}.png`,
            'image/png'
        );
    } else {
        logger.info(`Test ${testResult}: ${testName}`);
    }

    // Clear browser storage after each test
    await page.context().clearCookies();
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
});

// Test configuration
test.describe.configure({ mode: 'parallel' });

export { test };