import { Page, BrowserContext, Browser, test as playwrightTest } from '@playwright/test';
import { Logger } from '@/logger/logger';
import { AllureReporter } from '@/reporting/allure-reporter';

export class TestBase {
    protected browser?: Browser;
    protected context?: BrowserContext;
    protected page?: Page;
    protected logger: Logger;
    protected allureReporter: AllureReporter;

    constructor() {
        this.logger = Logger.getInstance();
        this.allureReporter = new AllureReporter();
    }

    // ==================== GETTERS ====================
    get pageInstance(): Page | undefined { return this.page; }
    get contextInstance(): BrowserContext | undefined { return this.context; }
    get browserInstance(): Browser | undefined { return this.browser; }

    // ==================== INITIALIZATION ====================
    initializeForTest(page?: Page, context?: BrowserContext, browser?: Browser): void {
        if (page) this.page = page;
        if (context) this.context = context;
        if (browser) this.browser = browser;
    }

    async teardownAfterTest(): Promise<void> {
        this.logPass('TestBase teardown started');
        if (this.page) await this.closePage();
        if (this.context) await this.closeContext();
        if (this.browser) await this.closeBrowser();
        this.logPass('TestBase teardown completed');
    }

    async takeScreenshot(name: string): Promise<string | undefined> {
        if (!this.page) return undefined;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const path = `reports/screenshots/${name}-${timestamp}.png`;
        await this.page.screenshot({ path });
        this.addAttachment(name, path, 'image/png');
        this.logPass(`Screenshot taken: ${name}`);
        return path;
    }

    attachToAllure(name: string, content: Buffer | string, mimeType: string = 'text/plain'): void {
        this.allureReporter.addAttachment(name, content, mimeType);
    }

    async handleTestFailure(error: Error): Promise<void> {
        this.logFail(`Test failed: ${error.message}`);
        if (this.page) await this.takeScreenshot('failure-screenshot');
        this.allureReporter.addErrorDetails(error);
        this.attachToAllure('Error Stack Trace', error.stack || error.message, 'text/plain');
    }

    async clearCookiesAndStorage(): Promise<void> {
        if (!this.context) return;
        await this.context.clearCookies();
        if (this.page) {
            await this.page.evaluate(() => {
                localStorage.clear();
                sessionStorage.clear();
            });
        }
        this.logPass('Cookies and storage cleared');
    }

    // ==================== BROWSER CONTROLS ====================
    async closePage(): Promise<void> {
        if (!this.page) return;
        await this.page.close();
        this.page = undefined as any;
        this.logPass('Page closed');
    }

    async closeContext(): Promise<void> {
        if (!this.context) return;
        await this.context.close();
        this.context = undefined as any;
        this.logPass('Browser context closed');
    }

    async closeBrowser(): Promise<void> {
        if (!this.browser) return;
        await this.browser.close();
        this.browser = undefined as any;
        this.logPass('Browser closed');
    }

    // ==================== LOGGING ====================
    protected logPass(message: string): void {
        this.logger.info(`PASS: ${message}`);
        this.allureReporter.addStep(message, 'passed');
    }

    protected logFail(message: string): void {
        this.logger.error(`FAIL: ${message}`);
        this.allureReporter.addStep(message, 'failed');
    }

    protected addAttachment(name: string, content: Buffer | string, mimeType: string = 'text/plain'): void {
        this.allureReporter.addAttachment(name, content, mimeType);
    }

    // ==================== HOOKS ====================
    static beforeEach(fn: (testBase: TestBase, testInfo: any) => Promise<void> | void): void {
        playwrightTest.beforeEach(async ({ page, context, browser }, testInfo) => {
            const testBase = new TestBase();
            testBase.initializeForTest(page, context, browser);
            testBase.logPass(`Starting test: ${testInfo.title}`);
            await testBase.clearCookiesAndStorage();
            await fn(testBase, testInfo);
        });
    }

    static afterEach(fn: (testBase: TestBase, testInfo: any) => Promise<void> | void): void {
        playwrightTest.afterEach(async ({ page, context, browser }, testInfo) => {
            const testBase = new TestBase();
            testBase.initializeForTest(page, context, browser);

            if (testInfo.status === 'failed' && testInfo.error) {
                await testBase.handleTestFailure(testInfo.error as Error);
            } else {
                testBase.logPass(`Test passed: ${testInfo.title}`);
            }

            await fn(testBase, testInfo);
            await testBase.teardownAfterTest();
        });
    }
}
