import { allure } from 'allure-playwright';
import { Logger } from '@/logger/logger';
import { BaseReporter, TestResult, TestAttachment } from './base-reporter';

export class AllureReporter extends BaseReporter {
    constructor() {
        super();
    }

    /**
     * Add step to current test
     */
    addStep(stepName: string, stepDetails?: string): void {
        this.logger.info(`ALLURE: Adding step: ${stepName}`);
        allure.step(stepName, async () => {
            if (stepDetails) {
                this.logger.debug(stepDetails);
            }
        });
    }

    /**
     * Add attachment to current test
     */
    override addAttachment(name: string, content: string | Buffer, type: string): void {
        this.logger.debug(`ALLURE: Adding attachment: ${name} (${type})`);
        allure.attachment(name, content, type);
    }

    /**
     * Add screenshot attachment
     */
    async addScreenshot(name: string, screenshotPath: string): Promise<void> {
        this.logger.debug(`ALLURE: Adding screenshot: ${name} - ${screenshotPath}`);
        try {
            const fs = await import('fs');
            const content = fs.readFileSync(screenshotPath);
            allure.attachment(name, content, 'image/png');
        } catch (error) {
            this.logger.error(`Failed to add screenshot: ${screenshotPath}`, error);
        }
    }

    /**
     * Add JSON attachment
     */
    addJSONAttachment(name: string, data: any): void {
        this.logger.debug(`ALLURE: Adding JSON attachment: ${name}`);
        const jsonString = JSON.stringify(data, null, 2);
        allure.attachment(name, jsonString, 'application/json');
    }

    /**
     * Add test case ID
     */
    addTestCaseId(testCaseId: string): void {
        this.logger.debug(`ALLURE: Adding test case ID: ${testCaseId}`);
        allure.tms(testCaseId, '');
    }

    /**
     * Add issue link
     */
    addIssue(issueId: string, issueUrl?: string): void {
        this.logger.debug(`ALLURE: Adding issue: ${issueId}`);
        if (issueUrl) {
            allure.issue(issueId, issueUrl);
        } else {
            allure.issue(issueId, '');
        }
    }

    /**
     * Add test suite
     */
    addTestSuite(suiteName: string): void {
        this.logger.debug(`ALLURE: Adding test suite: ${suiteName}`);
        allure.suite(suiteName);
    }

    /**
     * Add test owner
     */
    addTestOwner(owner: string): void {
        this.logger.debug(`ALLURE: Adding test owner: ${owner}`);
        allure.owner(owner);
    }

    /**
     * Add test severity
     */
    addTestSeverity(severity: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'): void {
        this.logger.debug(`ALLURE: Adding test severity: ${severity}`);
        allure.severity(severity);
    }

    /**
     * Add test label
     */
    addTestLabel(name: string, value: string): void {
        this.logger.debug(`ALLURE: Adding test label: ${name}: ${value}`);
        allure.label(name, value);
    }

    /**
     * Add test tag
     */
    addTestTag(tag: string): void {
        this.logger.debug(`ALLURE: Adding test tag: ${tag}`);
        allure.tag(tag);
    }

    /**
     * Add test description
     */
    addTestDescription(description: string): void {
        this.logger.debug(`ALLURE: Adding test description: ${description.substring(0, 100)}...`);
        allure.description(description);
    }

    /**
     * Add test link
     */
    addTestLink(name: string, url: string, type: 'tms' | 'issue' | 'custom' = 'custom'): void {
        this.logger.debug(`ALLURE: Adding test link: ${name}: ${url}`);
        allure.link(name, url, type);
    }

    /**
     * Add test parameter
     */
    addTestParameter(name: string, value: string, mode: 'hidden' | 'masked' | 'default' = 'default'): void {
        this.logger.debug(`ALLURE: Adding test parameter: ${name}: ${value}`);
        allure.parameter(name, value, { mode });
    }

    /**
     * Add test epic
     */
    addTestEpic(epic: string): void {
        this.logger.debug(`ALLURE: Adding test epic: ${epic}`);
        allure.epic(epic);
    }

    /**
     * Add test feature
     */
    addTestFeature(feature: string): void {
        this.logger.debug(`ALLURE: Adding test feature: ${feature}`);
        allure.feature(feature);
    }

    /**
     * Add test story
     */
    addTestStory(story: string): void {
        this.logger.debug(`ALLURE: Adding test story: ${story}`);
        allure.story(story);
    }

    /**
     * Add test layer
     */
    addTestLayer(layer: 'e2e' | 'api' | 'unit' | 'integration'): void {
        this.logger.debug(`ALLURE: Adding test layer: ${layer}`);
        allure.layer(layer);
    }

    /**
     * Add browser information
     */
    addBrowserInfo(browserName: string, version: string): void {
        this.logger.debug(`ALLURE: Adding browser info: ${browserName} ${version}`);
        allure.label('browser', browserName);
        allure.label('browser-version', version);
    }

    /**
     * Add environment information
     */
    addEnvironmentInfo(environment: string): void {
        this.logger.debug(`ALLURE: Adding environment info: ${environment}`);
        allure.label('environment', environment);
    }

    /**
     * Add error details
     */
    addErrorDetails(error: Error): void {
        this.logger.debug(`ALLURE: Adding error details: ${error.message}`);
        const errorData = {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        };
        this.addJSONAttachment('Error Details', errorData);
    }
}