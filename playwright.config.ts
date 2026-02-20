/*The playwright.config.ts file configures the Playwright test environment, specifying settings like browser options,
 *test directories, timeouts, retries, and reporting. Allows customizing global test behavior and browser configurations for different projects or environments.
 */


import { defineConfig, devices } from '@playwright/test';

const isLocal = !process.env.CI;
const isMaximized = process.env.MAXIMIZED || false;
const customLoggerPath = require.resolve('src/logger/logger.ts');

module.exports = defineConfig({
    //grep: /@smoke/,
    testDir: './tests',
    testMatch: ['**/*.spec.ts'],
    // Shared settings for all the projects below.  
    globalSetup: require.resolve('./test-setup/global-setup'),
    globalTeardown: require.resolve('./test-setup/global-teardown'),

    use: {
        //baseURL: '',
        headless: process.env.CI ? true : false,
        viewport: null, // Set custom size or maximize
        permissions: ['camera', 'microphone'],
        launchOptions: {
            args: ['--start-fullscreen',
                '--use-fake-ui-for-media-stream',
                '--use-fake-device-for-media-stream',
                '--max-old-space-size=4096'
            ],

        },
        /* Records traces after each test failure for debugging purposes. */
        // trace: 'retain-on-failure',
        /* Captures screenshots after each test failure to provide visual context. */
        screenshot: 'only-on-failure',
        /* Sets a timeout for actions like click, fill, select to prevent long-running operations. */
        actionTimeout: Number(process.env.long) || 30000,
        /* Sets a timeout for page loading navigations like goto URL, go back, reload, waitForNavigation to prevent long page loads. */
        navigationTimeout: Number(process.env.long) || 30000,
    },
    outputDir: 'test-results/', // Output directory for test artifacts

    timeout: Number(process.env.long) || 60000,  // Increase timeout to handle longer test executions
    expect: {
        timeout: Number(process.env.long) || 10000,
    },
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    //forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    //retries: process.env.CI ? 1 : 1,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['line'], // Default console reporter
        ['allure-playwright', { outputFolder: 'allure-results' }], // Allure reporter
        ['junit', { outputFile: 'test-results/results.xml' }], // Optional: JUnit XML report for compatibility
        [customLoggerPath], ['html', { open: 'never' }], ['dot']
    ],


    /* Configure projects for major browsers */
    projects: isLocal
        ? [
            {
                name: 'chromium',
                use: {
                    viewport: null,
                    launchOptions: {
                        args: ['--disable-web-security', '--start-maximized'],
                        // channel: 'chrome',
                        slowMo: 0,
                        headless: false,
                    },
                },
            },
            // {
            //   name: 'chromiumheadless',
            //   use: {
            //     ...devices['Desktop Chrome'],
            //     viewport: { width: 1920, height: 1080 },
            //     launchOptions: {
            //       args: ['--disable-web-security'],         
            //       slowMo: 0,
            //       headless: true,
            //     },
            //   },
            // },           
        ]

        : [

            // {
            //   name: 'chromium',
            //   use: { ...devices['Desktop Chrome'] },
            // },   
            // {
            //   name: 'webkit',
            //   use: { ...devices['Desktop Safari'] },
            // },
        ],

}
);

