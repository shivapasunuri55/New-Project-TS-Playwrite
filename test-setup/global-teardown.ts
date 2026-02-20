import { FullConfig } from '@playwright/test';
import { Logger } from '@/logger/logger';
import dotenv from 'dotenv';

const logger = new Logger();

async function globalTeardown(config: FullConfig): Promise<void> {
    logger.info('Starting global teardown...');

    // Ensure environment variables are loaded for cleanup operations
    if (process.env.environment) {
        logger.info(`Using environment variables for: ${process.env.environment}`);
        dotenv.config({
            path: `config/env/.env.${process.env.environment}`,
            override: true
        });
    }

    try {
        // Generate reports
        await generateReports();

        // Clean up temporary files
        await cleanupTempFiles();

        logger.info('Global teardown completed successfully');
    } catch (error) {
        logger.error('Global teardown failed:', error);
        // Don't throw error to avoid masking test failures
    }
}


async function generateReports(): Promise<void> {
    logger.info('Generating test reports...');

    try {
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);

        // Generate Allure report
        await execAsync('npx allure generate allure-results --clean -o allure-report');
        logger.info('Allure report generated successfully');

        // Copy reports to reports directory
        const fs = require('fs');
        const path = require('path');

        if (fs.existsSync('allure-report')) {
            if (fs.existsSync('reports/allure-report')) {
                fs.rmSync('reports/allure-report', { recursive: true });
            }
            fs.renameSync('allure-report', 'reports/allure-report');
            logger.info('Allure report moved to reports directory');
        }

    } catch (error) {
        logger.warn('Failed to generate reports:', error);
    }
}

async function cleanupTempFiles(): Promise<void> {
    logger.info('Cleaning up temporary files...');

    try {
        const fs = require('fs');
        const path = require('path');

        // Clean up test artifacts
        const tempDirectories = [
            'test-results',
            'playwright-report',
            'allure-results',
        ];

        for (const dir of tempDirectories) {
            if (fs.existsSync(dir)) {
                fs.rmSync(dir, { recursive: true, force: true });
                logger.info(`Cleaned up directory: ${dir}`);
            }
        }

        // Clean up old log files (older than 7 days)
        const logsDir = 'logs';
        if (fs.existsSync(logsDir)) {
            const files = fs.readdirSync(logsDir);
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

            for (const file of files) {
                const filePath = path.join(logsDir, file);
                const stats = fs.statSync(filePath);

                if (stats.mtime.getTime() < sevenDaysAgo) {
                    fs.unlinkSync(filePath);
                    logger.info(`Deleted old log file: ${file}`);
                }
            }
        }

        logger.info('Temporary files cleanup completed');
    } catch (error) {
        logger.warn('Failed to cleanup temporary files:', error);
    }
}

export default globalTeardown;
