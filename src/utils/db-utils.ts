import { Logger } from '@/logger/logger';
import { AllureReporter } from '@/reporting/allure-reporter';

/**
 * Interface for generic DB clients (Oracle, MySQL, Postgres, etc.)
 */
export interface DBClient {
    getConnection(config: any): Promise<any>;
}

/**
 * Config interface for DB connections
 */
export interface DBConfig {
    user?: string;
    password?: string;
    connectString?: string;   // Oracle style
    host?: string;
    database?: string;
    port?: number;
}

export class DBUtils {
    private static logger = Logger.getInstance();
    private static allureReporter = new AllureReporter();
    /**
     * Get database configuration from environment variables.
     * Supports multiple DB types (oracle, mysql, postgres, etc.)
     */
    public static getConfig(dbType: 'oracle' | 'mysql' | 'postgres'): DBConfig {
        this.logger.info(`Getting database configuration for ${dbType}`);
        this.allureReporter.addStep(`Get database configuration for ${dbType}`);

        switch (dbType) {
            case 'oracle':
                return {
                    user: process.env.ORACLE_DB_USER || '',
                    password: process.env.ORACLE_DB_PASS || '',
                    connectString: process.env.ORACLE_DB_URL || '',
                };
            case 'mysql':
                return {
                    host: process.env.MYSQL_DB_HOST || '',
                    user: process.env.MYSQL_DB_USER || '',
                    password: process.env.MYSQL_DB_PASS || '',
                    database: process.env.MYSQL_DB_NAME || '',
                    port: process.env.MYSQL_DB_PORT ? Number(process.env.MYSQL_DB_PORT) : 3306,
                };
            default:
                const error = `Unsupported DB type: ${dbType}`;
                this.logger.error(error);
                this.allureReporter.addStep(`Error: ${error}`);
                throw new Error(error);
        }
    }

    /**
     * Establishes a DB connection using the given client and config.
     */
    public static async getConnection(client: DBClient, config: DBConfig): Promise<any> {
        this.logger.info('Attempting to connect to database...');
        this.allureReporter.addStep('Connect to database');

        try {
            if (!config) {
                const error = 'Missing DB configuration.';
                this.logger.error(error);
                this.allureReporter.addStep(`Error: ${error}`);
                throw new Error(error);
            }

            const connection = await client.getConnection(config);
            this.logger.info('Database connection established.');
            this.allureReporter.addStep('Database connection established');

            return connection;
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.logger.error('Error establishing DB connection:', error.message);
                this.allureReporter.addStep(`Database connection failed: ${error.message}`);
                throw new Error(`Failed to connect: ${error.message}`);
            } else {
                this.logger.error('Unexpected error during DB connection:', error);
                this.allureReporter.addStep('Database connection failed: Unexpected error');
                throw new Error('Failed to connect: Unexpected error');
            }
        }
    }

    /**
     * Executes a SQL query on the given connection.
     */
    public static async executeQuery<T = any>(
        connection: any,
        query: string,
        params: any[] = []
    ): Promise<T[]> {
        this.logger.info(`Executing query: ${query.substring(0, 100)}...`);
        this.allureReporter.addStep(`Execute query: ${query.substring(0, 100)}...`);

        try {
            const result = await connection.execute(query, params);
            this.logger.info('Query executed successfully.');
            this.allureReporter.addStep('Query executed successfully');

            if (result.rows) {
                return result.rows as T[];
            }
            if (Array.isArray(result)) {
                return result as T[];
            }

            return [];
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.logger.error('Error executing query:', error.message);
                this.allureReporter.addStep(`Query execution failed: ${error.message}`);
                throw new Error(`Query execution failed: ${error.message}`);
            } else {
                this.logger.error('Unexpected error during query execution:', error);
                this.allureReporter.addStep('Query execution failed: Unexpected error');
                throw new Error('Query execution failed: Unexpected error');
            }
        }
    }

    /**
     * Closes the given DB connection.
     */
    public static async closeConnection(connection: any): Promise<void> {
        this.logger.info('Closing database connection...');
        this.allureReporter.addStep('Close database connection');

        if (connection) {
            try {
                await connection.close();
                this.logger.info('Database connection closed.');
                this.allureReporter.addStep('Database connection closed');
            } catch (error: unknown) {
                if (error instanceof Error) {
                    this.logger.error('Error closing DB connection:', error.message);
                    this.allureReporter.addStep(`Error closing connection: ${error.message}`);
                } else {
                    this.logger.error('Unexpected error while closing DB connection:', error);
                    this.allureReporter.addStep('Error closing connection: Unexpected error');
                }
            }
        } else {
            this.logger.warn('No connection to close.');
            this.allureReporter.addStep('No connection to close');
        }
    }
}
