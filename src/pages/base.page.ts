import { Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { Logger } from '@/logger/logger';
import { AllureReporter } from '@/reporting/allure-reporter';
import { ENV } from '@config/env';

export abstract class BasePage {
    protected readonly page: Page;
    protected readonly context: BrowserContext | undefined;
    protected readonly browser: Browser | undefined;
    protected readonly logger: Logger;
    protected readonly allureReporter: AllureReporter;

    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        this.page = page;
        this.context = context;
        this.browser = browser;
        this.logger = Logger.getInstance();
        this.allureReporter = new AllureReporter();
    }

    // ==================== PAGE NAVIGATION ====================

    async navigateTo(url: string): Promise<void> {
        this.logger.info(`Navigate to: ${url}`);
        this.allureReporter.addStep(`Navigate to: ${url}`);
        await this.page.goto(url, { waitUntil: 'load', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
    }

    async reloadPage(): Promise<void> {
        this.logger.info('Reload page');
        await this.page.reload({ waitUntil: 'load' });
    }

    async goBack(): Promise<void> {
        this.logger.info('Go back');
        await this.page.goBack();
    }

    async goForward(): Promise<void> {
        this.logger.info('Go forward');
        await this.page.goForward();
    }

    // ==================== PAGE INFO ====================

    async getPageTitle(): Promise<string> {
        const title = await this.page.title();
        this.logger.info(`Page title: ${title}`);
        return title;
    }

    getCurrentUrl(): string {
        const url = this.page.url();
        this.logger.info(`Current URL: ${url}`);
        return url;
    }

    async getPageContent(): Promise<string> {
        const content = await this.page.content();
        this.logger.info('Get page content');
        return content;
    }

    // ==================== SCREENSHOTS ====================

    async takeScreenshot(name: string = 'screenshot'): Promise<Buffer> {
        this.logger.info(`Take screenshot: ${name}`);
        this.allureReporter.addStep(`Take screenshot: ${name}`);
        const screenshot = await this.page.screenshot({ fullPage: true });
        this.addAttachment(name, screenshot, 'image/png');
        return screenshot;
    }

    // ==================== BROWSER CONTROL ====================

    async setViewportSize(width: number, height: number): Promise<void> {
        this.logger.info(`Set viewport: ${width}x${height}`);
        await this.page.setViewportSize({ width, height });
    }

    async closePage(): Promise<void> {
        this.logger.info('Close page');
        await this.page.close();
    }

    // ==================== UTILITY ====================

    getLocator(selector: string): Locator {
        return this.page.locator(selector);
    }

    async executeScript(script: string, ...args: any[]): Promise<any> {
        this.logger.info('Execute script');
        const result = await this.page.evaluate(script, ...args);
        return result;
    }

    // ==================== LOGGING & REPORTING UTILITIES ====================

    /**
     * Log step with Allure reporting
     */
    protected logStep(message: string): void {
        this.logger.info(`STEP: ${message}`);
        this.allureReporter.addStep(message);
    }


    protected addAttachment(name: string, content: Buffer | string, mimeType: string = 'text/plain'): void {
        this.allureReporter.addAttachment(name, content, mimeType);
    }
}
