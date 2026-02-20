# Playwright TypeScript Core Framework

A modern, scalable, and maintainable test automation framework built with Playwright and TypeScript, following industry best practices and clean architecture principles.

## 🚀 Features

- **Singleton Logger Pattern**: Winston-based logging with singleton instance for consistent logging across the framework
- **Page Object Model (POM)**: Clean separation of test logic and page interactions with BasePage class
- **Environment Management**: Centralized configuration using ENV object with TypeScript support
- **Allure Reporting**: Rich test reports with detailed step information and attachments
- **Database Integration**: Generic database utilities supporting Oracle, MySQL, and PostgreSQL
- **Utility Classes**: Reusable utilities for common operations (actions, files, dates, test data)
- **TestBase Class**: Comprehensive test lifecycle management with proper hooks
- **TypeScript**: Full type safety and IntelliSense support
- **Cross-Browser Testing**: Support for Chromium, Firefox, and WebKit
- **Built-in Waits**: Leverages Playwright's native waiting mechanisms
- **Error Handling**: Comprehensive error handling with automatic screenshots and logging

## 📁 Project Structure

```
playwright-ts-core/
├── config/
│   └── env.ts                    # Centralized environment configuration
├── test-base/
│   └── test-base.ts              # TestBase class with lifecycle hooks
├── src/
│   ├── pages/
│   │   └── base.page.ts          # BasePage class with common page methods
│   ├── utils/
│   │   ├── action-utils.ts       # Action utilities (click, fill, etc.)
│   │   ├── common-utils.ts       # Common utility functions
│   │   ├── date-utils.ts         # Date manipulation utilities
│   │   ├── file-utils.ts         # File operations utilities
│   │   ├── test-data-utils.ts    # Test data management utilities
│   │   └── db-utils.ts           # Database utilities (Oracle, MySQL, PostgreSQL)
│   ├── logger/
│   │   └── logger.ts             # Winston-based singleton logger
│   └── reporting/
│       └── allure-reporter.ts    # Allure reporting utilities
├── tests/
│   └── specs/                    # Test specifications
├── reports/
│   ├── screenshots/              # Test failure screenshots
│   ├── allure-results/           # Allure test results
│   └── allure-report/            # Generated Allure reports
├── logs/
│   └── app.log                   # Application logs
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playwright-ts-core
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file with your configuration
   # The framework uses ENV object from config/env.ts
   ```

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run tests with UI
npx playwright test --ui

# Run specific test file
npx playwright test tests/specs/login.spec.ts

# Run tests with specific tag
npx playwright test --grep "@smoke"

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Generating Reports

```bash
# Generate Allure report
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report

# View test results
npx playwright show-report
```

### Code Quality

```bash
# Run TypeScript compiler
npx tsc --noEmit

# Run linting (if configured)
npx eslint .

# Format code (if configured)
npx prettier --write .
```

## 📝 Writing Tests

### Basic Test Structure with TestBase

```typescript
import { test, expect } from '@playwright/test';
import { TestBase } from '../test-base/test-base';
import { BasePage } from '../src/pages/base.page';

test.describe('Login Functionality', () => {
  let testBase: TestBase;
  let basePage: BasePage;

  test.beforeEach(async ({ page, context, browser }) => {
    testBase = new TestBase();
    testBase.initializeForTest(page, context, browser);
    basePage = new BasePage(page);
  });

  test('should login successfully', async ({ page }) => {
    await basePage.navigateTo(ENV.BASE_URL);
    await basePage.fill('#username', 'testuser');
    await basePage.fill('#password', 'testpass');
    await basePage.click('#login-button');
    await expect(page).toHaveURL(/dashboard/);
  });

  test.afterEach(async () => {
    await testBase.teardownAfterTest();
  });
});
```

### Using TestBase Hooks

```typescript
import { TestBase } from '../test-base/test-base';

// Global setup
TestBase.beforeAll(async (testBase) => {
  testBase.logger.info('Setting up global test environment');
  // Database connections, global data setup
});

// Test-specific setup
TestBase.beforeEach(async (testBase, testInfo) => {
  testBase.logger.info(`Starting test: ${testInfo.title}`);
  await testBase.setupTest(testInfo.title, testInfo);
});

// Test-specific cleanup
TestBase.afterEach(async (testBase, testInfo) => {
  testBase.logger.info(`Completing test: ${testInfo.title}`);
  await testBase.teardownTest(testInfo.title, testInfo);
});

// Global cleanup
TestBase.afterAll(async (testBase) => {
  testBase.logger.info('Cleaning up global test environment');
  // Close connections, cleanup data
});
```

### Page Object Model with BasePage

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly usernameField = '#username';
  private readonly passwordField = '#password';
  private readonly loginButton = '#login-button';

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameField, username);
    await this.fill(this.passwordField, password);
    await this.click(this.loginButton);
  }

  async verifyLoginSuccess(): Promise<void> {
    await this.waitForSelector('.dashboard');
  }
}
```

### Database Testing

```typescript
import { DBUtils } from '../src/utils/db-utils';

test('should verify user in database', async () => {
  const config = DBUtils.getConfig('mysql');
  const connection = await DBUtils.getConnection(mysqlClient, config);
  
  const users = await DBUtils.executeQuery(
    connection,
    'SELECT * FROM users WHERE username = ?',
    ['testuser']
  );
  
  expect(users).toHaveLength(1);
  
  await DBUtils.closeConnection(connection);
});
```

## 🔧 Configuration

### Environment Configuration

The framework uses a centralized ENV object for configuration:

```typescript
// config/env.ts
export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://example.com',
  API_URL: process.env.API_URL || 'https://api.example.com',
  TIMEOUTS: {
    DEFAULT: process.env.DEFAULT_TIMEOUT || '30000',
    SHORT: process.env.SHORT_TIMEOUT || '10000',
    LONG: process.env.LONG_TIMEOUT || '60000'
  },
  DATABASE: {
    ORACLE_DB_URL: process.env.ORACLE_DB_URL || '',
    MYSQL_DB_HOST: process.env.MYSQL_DB_HOST || '',
    PG_DB_HOST: process.env.PG_DB_HOST || ''
  }
};
```

### Test Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import { ENV } from './config/env';

export default defineConfig({
  testDir: './tests/specs',
  timeout: parseInt(ENV.TIMEOUTS.DEFAULT),
  retries: 2,
  use: {
    baseURL: ENV.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

## 📊 Reporting

### Allure Reports

The framework generates comprehensive Allure reports with:

- Test execution details
- Step-by-step test flow
- Screenshots and videos
- Database query logs
- Error details and stack traces
- Custom test labels and attachments

### Logger Integration

```typescript
import { Logger } from '../src/logger/logger';

const logger = Logger.getInstance();
logger.info('Test step completed');
logger.pass('Test assertion passed');
logger.fail('Test assertion failed');
logger.error('Error occurred', error);
```

## 🗄️ Database Integration

### Database Utilities

```typescript
import { DBUtils } from '../src/utils/db-utils';

// Get database configuration
const config = DBUtils.getConfig('mysql');

// Connect to database
const connection = await DBUtils.getConnection(mysqlClient, config);

// Execute queries
const result = await DBUtils.executeQuery(
  connection,
  'SELECT * FROM users WHERE id = ?',
  [userId]
);

// Close connection
await DBUtils.closeConnection(connection);
```

### Supported Databases

- **Oracle**: Using Oracle client
- **MySQL**: Using MySQL client
- **PostgreSQL**: Using PostgreSQL client

## 🧪 Test Data Management

### Test Data Utilities

```typescript
import { TestDataUtils } from '../src/utils/test-data-utils';

// Get test data from JSON
const userData = TestDataUtils.getTestData('users', 'validUser');

// Generate random data
const randomUser = TestDataUtils.generateRandomUserData();

// Load test data from file
const testData = TestDataUtils.loadTestData('test-data.json');
```

### Utility Classes

The framework includes several utility classes:

- **ActionUtils**: Common page actions (click, fill, select, etc.)
- **CommonUtils**: General utility functions
- **DateUtils**: Date manipulation and formatting
- **FileUtils**: File operations and management
- **TestDataUtils**: Test data generation and management

## 🚀 CI/CD Integration

### GitHub Actions (Optional)

The framework can be integrated with CI/CD pipelines for:

- Type checking with TypeScript
- E2E tests across multiple browsers
- Automated reporting with Allure
- Screenshot comparison
- Database testing
- Cross-platform testing

### Pipeline Stages

1. **Code Quality**: TypeScript compilation, linting
2. **E2E Tests**: Playwright tests across browsers
3. **Database Tests**: Database integration testing
4. **Reporting**: Allure report generation
5. **Deployment**: Optional deployment to test environments

## 📈 Best Practices

### Test Organization

- Use TestBase class for consistent test lifecycle management
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated

### Page Object Model

- Extend BasePage class for all page objects
- Encapsulate page interactions
- Use meaningful method names
- Leverage Playwright's built-in waits instead of custom wait utilities

### Logger Usage

- Use singleton Logger instance: `Logger.getInstance()`
- Use appropriate log levels (info, debug, warn, error, pass, fail)
- Log important test steps and assertions
- Use AllureReporter for test reporting

### Database Testing

- Use DBUtils for all database operations
- Always close connections after use
- Use parameterized queries to prevent SQL injection
- Handle database errors gracefully

### Error Handling

- Use TestBase.handleTestFailure() for test failures
- Take screenshots on test failures
- Log errors with context using the logger
- Use Playwright's built-in error handling

### Performance

- Use Playwright's native waiting mechanisms
- Minimize test execution time
- Use parallel execution when possible
- Optimize selectors for better performance

## 🐛 Troubleshooting

### Common Issues

1. **Browser not found**
   ```bash
   npx playwright install
   ```

2. **Tests timing out**
   - Check network connectivity
   - Increase timeout values in ENV configuration
   - Verify selectors and page load times

3. **Database connection issues**
   - Check environment variables for database configuration
   - Verify database server is running
   - Check firewall settings and connection strings

4. **Logger not working**
   - Ensure Winston is installed: `npm install winston @types/winston`
   - Check logs directory permissions
   - Verify logger singleton usage

5. **TestBase hooks not working**
   - Ensure proper import of TestBase class
   - Check hook implementation in test files
   - Verify Playwright fixtures are properly passed

### Debug Mode

```bash
# Run tests in debug mode
npx playwright test --debug

# Run specific test in debug mode
npx playwright test tests/specs/login.spec.ts --debug

# Run with UI mode
npx playwright test --ui
```

### Logging

Check the logs directory for detailed execution logs:

```bash
# View application logs
tail -f logs/app.log

# View error logs (if separate error log is configured)
tail -f logs/error.log
```

### Environment Configuration

Verify your environment configuration:

```typescript
// Check if ENV object is properly configured
import { ENV } from './config/env';
console.log('Base URL:', ENV.BASE_URL);
console.log('Timeouts:', ENV.TIMEOUTS);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the framework patterns
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Development Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run tests
npx playwright test

# Run TypeScript compiler
npx tsc --noEmit

# Generate Allure reports
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Playwright team for the excellent testing framework
- Allure team for comprehensive reporting
- Winston team for robust logging
- TypeScript team for type safety

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

---

**Happy Testing with Playwright TypeScript Core! 🎉**



