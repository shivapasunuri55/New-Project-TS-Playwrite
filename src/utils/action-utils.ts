import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '@/logger/logger';
import { AllureReporter } from '@/reporting/allure-reporter';

export class ActionUtils {
    private static logger = Logger.getInstance();
    private static allureReporter = new AllureReporter();

    /**
     * Internal Helper - Get locator with stable and visible options
     */
    private static async getLocatorWithStableAndVisibleOptions(
        input: string | Locator,
        options: any = {}
    ): Promise<Locator> {
        const page = options.page;
        if (!page) {
            throw new Error('Page is required for locator operations');
        }

        const locator = typeof input === 'string' ? page.locator(input) : input;
        // Wait for element to be visible using Playwright's built-in wait
        await locator.waitFor({ state: 'visible', timeout: options.timeout || 30000 });
        return locator;
    }

    // ==================== CLICK ACTIONS ====================

    /**
     * Click on element
     */
    static async click(input: string | Locator, options: any = {}): Promise<void> {
        this.logger.info(`Click: ${typeof input === 'string' ? input : 'locator'}`);
        this.allureReporter.addStep(`Click element`);
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.click(options);
    }

    /**
     * Click and wait for navigation
     */
    static async clickAndNavigate(input: string | Locator, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.click({ ...options, noWaitAfter: false });

        if (options.page) {
            await options.page.waitForLoadState('networkidle');
        }
    }

    /**
     * Click using JavaScript
     */
    static async clickByJS(input: string | Locator, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.evaluate((element: HTMLElement) => element.click());
    }

    // ==================== FILL / TYPING ACTIONS ====================

    /**
     * Fill input field
     */
    static async fill(input: string | Locator, value: string, options: any = {}): Promise<void> {
        this.logger.info(`Fill: ${value}`);
        this.allureReporter.addStep(`Fill input: ${value}`);
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.fill(value, options);
    }

    /**
     * Fill input and press Enter
     */
    static async fillAndEnter(input: string | Locator, value: string, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.fill(value);
        await locator.press('Enter');
    }

    /**
     * Fill input and press Tab
     */
    static async fillAndTab(input: string | Locator, value: string, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.fill(value);
        await locator.press('Tab');
    }

    /**
     * Fill input and type additional text
     */
    static async fillAndType(input: string | Locator, value: string, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.fill(value);
        await locator.type(options.additionalText || '', options);
    }

    /**
     * Press keys sequentially
     */
    static async pressSequentially(input: string | Locator, value: string, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.pressSequentially(value, options);
    }

    /**
     * Press page keyboard key
     */
    static async pressPageKeyboard(key: string, options: any = {}): Promise<void> {
        const page = options.page;
        if (!page) {
            throw new Error('Page is required for keyboard operations');
        }
        await page.keyboard.press(key);
    }


    /**
     * Clear input field
     */
    static async clear(input: string | Locator, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.clear(options);
    }

    /**
     * Clear input field using JavaScript
     */
    static async clearByJS(input: string | Locator, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.evaluate((element: HTMLInputElement) => {
            element.value = '';
            element.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }

    // ==================== CHECKBOX / RADIO ACTIONS ====================

    /**
     * Check checkbox or radio button
     */
    static async check(input: string | Locator, options: any = {}): Promise<void> {
        this.logger.info('Check element');
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.check(options);
    }

    /**
     * Uncheck checkbox
     */
    static async uncheck(input: string | Locator, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.uncheck(options);
    }

    // ==================== DROPDOWN SELECT ACTIONS ====================

    /**
     * Select option by value
     */
    static async selectByValue(input: string | Locator, value: string, options: any = {}): Promise<void> {
        this.logger.info(`Select: ${value}`);
        this.allureReporter.addStep(`Select option: ${value}`);
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.selectOption({ value }, options);
    }

    /**
     * Select multiple options by values
     */
    static async selectByValues(input: string | Locator, values: string[], options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.selectOption(values.map(value => ({ value })), options);
    }

    /**
     * Select option by text
     */
    static async selectByText(input: string | Locator, text: string, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.selectOption({ label: text }, options);
    }

    /**
     * Select option by index
     */
    static async selectByIndex(input: string | Locator, index: number, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.selectOption({ index }, options);
    }

    // ==================== ALERT / DIALOG HANDLING ====================

    /**
     * Accept alert
     */
    static async acceptAlert(input: string | Locator, options: any = {}): Promise<void> {
        const page = options.page;
        if (!page) {
            throw new Error('Page is required for alert operations');
        }
        page.on('dialog', (dialog: any) => dialog.accept());
    }

    /**
     * Dismiss alert
     */
    static async dismissAlert(input: string | Locator, options: any = {}): Promise<void> {
        const page = options.page;
        if (!page) {
            throw new Error('Page is required for alert operations');
        }
        page.on('dialog', (dialog: any) => dialog.dismiss());
    }

    /**
     * Get alert text
     */
    static async getAlertText(input: string | Locator, options: any = {}): Promise<string> {
        const page = options.page;
        if (!page) {
            throw new Error('Page is required for alert operations');
        }

        return new Promise((resolve) => {
            page.on('dialog', (dialog: any) => {
                const text = dialog.message();
                dialog.accept();
                resolve(text);
            });
        });
    }

    // ==================== MOUSE / FOCUS ACTIONS ====================

    /**
     * Hover over element
     */
    static async hover(input: string | Locator, options: any = {}): Promise<void> {
        this.logger.info('Hover element');
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.hover(options);
    }

    /**
     * Focus on element
     */
    static async focus(input: string | Locator, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.focus(options);
    }

    /**
     * Drag and drop element
     */
    static async dragAndDrop(input: string | Locator, dest: string | Locator, options: any = {}): Promise<void> {
        const sourceLocator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        const destLocator = typeof dest === 'string' ? options.page.locator(dest) : dest;
        await sourceLocator.dragTo(destLocator, options);
    }

    /**
     * Double click element
     */
    static async doubleClick(input: string | Locator, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.dblclick(options);
    }

    // ==================== FILE HANDLING ====================

    /**
     * Download file
     */
    static async downloadFile(input: string | Locator, path: string, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        const downloadPromise = options.page.waitForEvent('download');
        await locator.click();
        const download = await downloadPromise;
        await download.saveAs(path);
    }

    /**
     * Upload files
     */
    static async uploadFiles(input: string | Locator, path: string | string[], options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.setInputFiles(path);
    }

    // ==================== SCROLLING ====================

    /**
     * Scroll locator into view
     */
    static async scrollLocatorIntoView(input: string | Locator, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.scrollIntoViewIfNeeded(options);
    }

    /**
     * Scroll to element
     */
    static async scrollToElement(input: string | Locator, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.scrollIntoViewIfNeeded(options);
    }

    /**
     * Scroll to top of screen
     */
    static async scrollToTopOfScreen(page: Page): Promise<void> {
        await page.evaluate(() => {
            window.scrollTo(0, 0);
        });
    }

    /**
     * Scroll to bottom of screen
     */
    static async scrollToBottomOfScreen(page: Page): Promise<void> {
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
    }

    // ==================== ELEMENT MANIPULATION METHODS ====================

    /**
     * Get element text content (including hidden text)
     */
    static async getElementTextContent(input: string | Locator, options: any = {}): Promise<string> {
        this.logger.info('Get text content');
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        const textContent = await locator.textContent();
        return textContent || '';
    }

    /**
     * Get element inner HTML
     */
    static async getElementInnerHTML(input: string | Locator, options: any = {}): Promise<string> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        const innerHTML = await locator.innerHTML();
        return innerHTML;
    }

    /**
     * Get element outer HTML
     */
    static async getElementOuterHTML(input: string | Locator, options: any = {}): Promise<string> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        const outerHTML = await locator.evaluate(el => el.outerHTML);
        return outerHTML;
    }

    /**
     * Get element value
     */
    static async getElementValue(input: string | Locator, options: any = {}): Promise<string> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        const value = await locator.inputValue();
        return value;
    }

    /**
     * Set element value
     */
    static async setElementValue(input: string | Locator, value: string, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.fill(value);
    }

    /**
     * Trigger custom event
     */
    static async triggerEvent(input: string | Locator, eventType: string, eventData?: any, options: any = {}): Promise<void> {
        const locator = await this.getLocatorWithStableAndVisibleOptions(input, options);
        await locator.evaluate((el: HTMLElement, args: { type: string; data: any }) => {
            const event = new CustomEvent(args.type, { detail: args.data });
            el.dispatchEvent(event);
        }, { type: eventType, data: eventData });
    }

    // ==================== MOUSE ACTIONS ====================

    /**
     * Simulate mouse movement
     */
    static async simulateMouseMovement(page: Page, fromX: number, fromY: number, toX: number, toY: number, steps: number = 10): Promise<void> {
        const deltaX = (toX - fromX) / steps;
        const deltaY = (toY - fromY) / steps;

        for (let i = 0; i <= steps; i++) {
            const x = fromX + (deltaX * i);
            const y = fromY + (deltaY * i);

            await page.mouse.move(x, y);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}
