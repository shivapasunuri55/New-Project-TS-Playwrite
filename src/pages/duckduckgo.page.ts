import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';
import { ENV } from '@config/env';

export class DuckDuckGoPage extends BasePage {
    private readonly homeUrl = 'https://duckduckgo.com/';

    constructor(page: Page) {
        super(page);
    }

    async openHome(): Promise<void> {
        this.logStep('Open DuckDuckGo home');
        await this.navigateTo(this.homeUrl);
        await this.page.waitForLoadState('networkidle');
    }

    async assertTitleContainsDuckDuckGo(): Promise<void> {
        this.logStep('Assert page title contains DuckDuckGo');
        await expect(this.page).toHaveTitle(/DuckDuckGo/i, {
            timeout: parseInt(ENV.TIMEOUTS.DEFAULT),
        });
    }

    searchInput(): Locator {
        // Prefer ARIA role; DDG uses a combobox-like input on home.
        return this.page.getByRole('combobox', { name: 'Search with DuckDuckGo' });
    }

    async assertSearchInputDefaultState(): Promise<void> {
        this.logStep('Assert search input is visible, enabled, and empty by default');
        const input = this.searchInput();
        await input.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await expect(input).toBeEnabled();
        await expect(input).toHaveValue('');
    }

    async fillSearch(text: string): Promise<void> {
        this.logStep(`Fill search input: ${text}`);
        const input = this.searchInput();
        await ActionUtils.fill(input, text, { page: this.page, timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await expect(input).toHaveValue(text);
    }

    async assertSearchValue(expected: string): Promise<void> {
        this.logStep(`Assert search input value equals: ${expected}`);
        await expect(this.searchInput()).toHaveValue(expected);
    }

    async clearSearch(): Promise<void> {
        this.logStep('Clear search input');
        const input = this.searchInput();
        await ActionUtils.clear(input, { page: this.page, timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await expect(input).toHaveValue('');
    }

    async submitSearchWithEnter(): Promise<void> {
        this.logStep('Submit search with ENTER');
        const input = this.searchInput();
        await input.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });

        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            input.press('Enter'),
        ]);
    }

    async assertUrlHasQuery(expectedQuery: string): Promise<void> {
        this.logStep(`Assert URL contains query for: ${expectedQuery}`);
        const expectedEncoded = encodeURIComponent(expectedQuery);
        await expect
            .poll(() => this.page.url(), { timeout: parseInt(ENV.TIMEOUTS.DEFAULT) })
            .toContain(expectedEncoded);
    }

    resultsContainer(): Locator {
        // Results page uses #links container; fallback to main region for resilience.
        return this.page.locator('#links, [data-testid="main"], main');
    }

    resultItems(): Locator {
        // Prefer stable result item structure.
        return this.page.locator('[data-testid="result"], article[data-testid="result"], #links .result');
    }

    async waitForResults(): Promise<void> {
        this.logStep('Wait for results container and at least one result item');
        const container = this.resultsContainer();
        await container.first().waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });

        const items = this.resultItems();
        await items.first().waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await expect(items).toHaveCountGreaterThan(0);
    }

    private firstResult(): Locator {
        return this.resultItems().first();
    }

    async firstResultTitleText(): Promise<string> {
        this.logStep('Read first result title text');
        const title = this.firstResult().locator('h2, [data-testid="result-title"], a[data-testid="result-title-a"]');
        await title.first().waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        return (await title.first().innerText()).trim();
    }

    async firstResultSnippetText(): Promise<string> {
        this.logStep('Read first result snippet text');
        const snippet = this.firstResult().locator(
            '[data-testid="result-snippet"], [data-testid="result-extras"], .result__snippet, .E2eVPzY9T4B76U8m3K0v'
        );
        await snippet.first().waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        return (await snippet.first().innerText()).trim();
    }

    async assertFirstResultMentions(term: string): Promise<void> {
        this.logStep(`Assert first result mentions term (case-insensitive): ${term}`);
        const titleText = await this.firstResultTitleText();
        const snippetText = await this.firstResultSnippetText();

        expect(titleText.length).toBeGreaterThan(0);
        expect(snippetText.length).toBeGreaterThan(0);

        const combined = `${titleText}\n${snippetText}`.toLowerCase();
        expect(combined).toContain(term.toLowerCase());
    }

    async assertQueryPersistsInInput(expected: string): Promise<void> {
        this.logStep(`Assert query persists in search input: ${expected}`);
        const input = this.searchInput();
        await input.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await expect(input).toHaveValue(expected);
    }

    async clearAndSearch(text: string): Promise<void> {
        this.logStep(`Clear search input and search for: ${text}`);
        await this.clearSearch();
        await this.fillSearch(text);
        await this.submitSearchWithEnter();
        await this.waitForResults();
        await this.assertQueryPersistsInInput(text);
    }
}
