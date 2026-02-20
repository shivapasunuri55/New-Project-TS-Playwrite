export interface AllureConfig {
    resultsDir: string;
    outputDir: string;
    environmentInfo: {
        browser: string;
        browserVersion: string;
        os: string;
        environment: string;
    };
}

export const defaultAllureConfig: AllureConfig = {
    resultsDir: 'allure-results',
    outputDir: 'allure-report',
    environmentInfo: {
        browser: 'Chrome',
        browserVersion: 'Latest',
        os: 'Windows',
        environment: 'QA'
    }
};

export class AllureConfigManager {
    private config: AllureConfig;

    constructor(config?: Partial<AllureConfig>) {
        this.config = { ...defaultAllureConfig, ...config };
    }

    /**
     * Get current configuration
     */
    getConfig(): AllureConfig {
        return this.config;
    }

    /**
     * Update configuration
     */
    updateConfig(updates: Partial<AllureConfig>): void {
        this.config = { ...this.config, ...updates };
    }

    /**
     * Get results directory
     */
    getResultsDir(): string {
        return this.config.resultsDir;
    }

    /**
     * Get output directory
     */
    getOutputDir(): string {
        return this.config.outputDir;
    }

    /**
     * Get environment info
     */
    getEnvironmentInfo(): AllureConfig['environmentInfo'] {
        return this.config.environmentInfo;
    }

    /**
     * Set browser info
     */
    setBrowserInfo(browser: string, version: string): void {
        this.config.environmentInfo.browser = browser;
        this.config.environmentInfo.browserVersion = version;
    }

    /**
     * Set OS info
     */
    setOSInfo(os: string): void {
        this.config.environmentInfo.os = os;
    }

    /**
     * Set environment
     */
    setEnvironment(environment: string): void {
        this.config.environmentInfo.environment = environment;
    }
}