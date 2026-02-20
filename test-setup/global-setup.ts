import { FullConfig } from '@playwright/test';
import { Logger } from '@/logger/logger';
import { config } from '@config/env';
import dotenv from 'dotenv';

const logger = new Logger();

async function globalSetup(config: FullConfig): Promise<void> {
    logger.info('Starting global setup...');

    // Load environment variables from .env files
    if (process.env.environment) {
        logger.info(`Loading environment variables for: ${process.env.environment}`);
        dotenv.config({
            path: `config/env/.env.${process.env.environment}`,
            override: true
        });
    } else {
        logger.info('No environment specified, using default configuration');
    }

    try {
        // Set up test environment
        await setupTestEnvironment();

        logger.info('Global setup completed successfully');
    } catch (error) {
        logger.error('Global setup failed:', error);
        throw error;
    }
}

async function setupTestEnvironment(): Promise<void> {
    logger.info('Setting up test environment...');

    // Set environment variables
    process.env.NODE_ENV = process.env.NODE_ENV;
    process.env.PLAYWRIGHT_TEST_BASE_URL = config.baseUrl;

    // Create necessary directories
    const fs = require('fs');

    const directories = [
        'reports',
        'reports/screenshots',
        'reports/allure-results',
        'reports/allure-report',
        'logs',
    ];

    for (const dir of directories) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            logger.info(`Created directory: ${dir}`);
        }
    }

    logger.info('Test environment setup completed');
}

export default globalSetup;
