import { DuckDuckGoPage } from '@/pages/duckduckgo.page';
import { expect, test } from '@test-setup/fixtures';

test.describe('DuckDuckGo Search', () => {
    test('DuckDuckGo search persists input and updates results for multiple queries', async ({ page, logger, allureReporter }) => {
        const ddg = new DuckDuckGoPage(page);

        const consoleErrors: string[] = [];
        const pageErrors: string[] = [];

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        page.on('pageerror', (err) => {
            pageErrors.push(err.message);
        });

        allureReporter.addStep('Navigate to DuckDuckGo');
        await ddg.openHome();

        allureReporter.addStep('Verify page title contains DuckDuckGo');
        await ddg.assertTitleContainsDuckDuckGo();

        allureReporter.addStep('Verify search input state');
        await ddg.assertSearchInputDefaultState();

        allureReporter.addStep("Search for 'Selenium' and submit with ENTER");
        await ddg.fillSearch('Selenium');
        await ddg.submitSearchWithEnter();

        allureReporter.addStep("Verify URL contains query for 'Selenium'");
        await ddg.assertUrlHasQuery('Selenium');

        allureReporter.addStep('Wait for results');
        await ddg.waitForResults();

        allureReporter.addStep('Assert at least one result is displayed');
        await expect(ddg.resultItems()).toHaveCountGreaterThan(0);

        allureReporter.addStep("Assert first result mentions 'Selenium' and has content");
        await ddg.assertFirstResultMentions('Selenium');

        allureReporter.addStep("Assert input still equals 'Selenium'");
        await ddg.assertQueryPersistsInInput('Selenium');

        allureReporter.addStep("Clear input and search for 'Playwright'");
        const firstResultBefore = await ddg.firstResultTitleText();
        await ddg.clearAndSearch('Playwright');

        allureReporter.addStep('Assert results update for Playwright');
        const firstResultAfter = await ddg.firstResultTitleText();
        expect(firstResultAfter).not.toEqual(firstResultBefore);

        // Ensure at least one result is related to Playwright.
        // Prefer checking the visible content of the first result; fall back to polling all results.
        const firstTitle = await ddg.firstResultTitleText();
        const firstSnippet = await ddg.firstResultSnippetText();
        const firstCombined = `${firstTitle}\n${firstSnippet}`.toLowerCase();

        if (!firstCombined.includes('playwright')) {
            const combinedResultsText = (await ddg.resultItems().allInnerTexts()).join('\n').toLowerCase();
            expect(combinedResultsText).toContain('playwright');
        } else {
            expect(firstCombined).toContain('playwright');
        }

        allureReporter.addStep('Final sanity: page responsive and no unexpected errors');
        await expect(ddg.searchInput()).toBeEnabled();

        logger.info(`Console errors captured: ${consoleErrors.length}`);
        logger.info(`Page errors captured: ${pageErrors.length}`);
        expect(consoleErrors, `Console errors: ${consoleErrors.join(' | ')}`).toEqual([]);
        expect(pageErrors, `Page errors: ${pageErrors.join(' | ')}`).toEqual([]);
    });
});
