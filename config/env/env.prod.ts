export const prodConfig = {
    TEST_ENV: 'prod',
    baseUrl: 'https://example.com',
    timeouts: {
        default: 30000,
        short: 10000,
        long: 60000,
    },
    retries: 0,
    headless: true,
    slowMo: 0,
    viewport: {
        width: 1280,
        height: 720,
    },
    Maximized: true,
    Local: true,
    CI: false
};
