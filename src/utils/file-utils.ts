import { Logger } from '@/logger/logger';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);

export class FileUtils {
    private static logger = Logger.getInstance();

    /**
     * Check if file exists
     */
    static async fileExists(filePath: string): Promise<boolean> {
        this.logger.debug(`Checking if file exists: ${filePath}`);

        try {
            await stat(filePath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if directory exists
     */
    static async directoryExists(dirPath: string): Promise<boolean> {
        this.logger.debug(`Checking if directory exists: ${dirPath}`);

        try {
            const stats = await stat(dirPath);
            return stats.isDirectory();
        } catch {
            return false;
        }
    }

    /**
     * Create directory if it doesn't exist
     */
    static async createDirectory(dirPath: string, recursive: boolean = true): Promise<void> {
        this.logger.debug(`Creating directory: ${dirPath}`);

        try {
            await mkdir(dirPath, { recursive });
            this.logger.info(`Directory created: ${dirPath}`);
        } catch (error) {
            this.logger.error(`Failed to create directory: ${dirPath}`, error);
            throw error;
        }
    }

    /**
     * Read file content
     */
    static async readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
        this.logger.debug(`Reading file: ${filePath}`);

        try {
            const content = await readFile(filePath, encoding);
            this.logger.info(`File read successfully: ${filePath}`);
            return content;
        } catch (error) {
            this.logger.error(`Failed to read file: ${filePath}`, error);
            throw error;
        }
    }

    /**
     * Write content to file
     */
    static async writeFile(filePath: string, content: string, encoding: BufferEncoding = 'utf8'): Promise<void> {
        this.logger.debug(`Writing file: ${filePath}`);

        try {
            // Create directory if it doesn't exist
            const dir = path.dirname(filePath);
            await this.createDirectory(dir);

            await writeFile(filePath, content, encoding);
            this.logger.info(`File written successfully: ${filePath}`);
        } catch (error) {
            this.logger.error(`Failed to write file: ${filePath}`, error);
            throw error;
        }
    }

    /**
     * Append content to file
     */
    static async appendFile(filePath: string, content: string, encoding: BufferEncoding = 'utf8'): Promise<void> {
        this.logger.debug(`Appending to file: ${filePath}`);

        try {
            // Create directory if it doesn't exist
            const dir = path.dirname(filePath);
            await this.createDirectory(dir);

            await fs.promises.appendFile(filePath, content, encoding);
            this.logger.info(`Content appended to file: ${filePath}`);
        } catch (error) {
            this.logger.error(`Failed to append to file: ${filePath}`, error);
            throw error;
        }
    }

    /**
     * Delete file
     */
    static async deleteFile(filePath: string): Promise<void> {
        this.logger.debug(`Deleting file: ${filePath}`);

        try {
            await unlink(filePath);
            this.logger.info(`File deleted: ${filePath}`);
        } catch (error) {
            this.logger.error(`Failed to delete file: ${filePath}`, error);
            throw error;
        }
    }

    /**
     * Delete directory
     */
    static async deleteDirectory(dirPath: string, recursive: boolean = true): Promise<void> {
        this.logger.debug(`Deleting directory: ${dirPath}`);

        try {
            if (recursive) {
                await fs.promises.rm(dirPath, { recursive: true, force: true });
            } else {
                await rmdir(dirPath);
            }
            this.logger.info(`Directory deleted: ${dirPath}`);
        } catch (error) {
            this.logger.error(`Failed to delete directory: ${dirPath}`, error);
            throw error;
        }
    }


    /**
     * Copy file
     */
    static async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
        this.logger.debug(`Copying file: ${sourcePath} -> ${destinationPath}`);

        try {
            // Create destination directory if it doesn't exist
            const destDir = path.dirname(destinationPath);
            await this.createDirectory(destDir);

            await fs.promises.copyFile(sourcePath, destinationPath);
            this.logger.info(`File copied: ${sourcePath} -> ${destinationPath}`);
        } catch (error) {
            this.logger.error(`Failed to copy file: ${sourcePath} -> ${destinationPath}`, error);
            throw error;
        }
    }

    /**
     * Move file
     */
    static async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
        this.logger.debug(`Moving file: ${sourcePath} -> ${destinationPath}`);

        try {
            // Create destination directory if it doesn't exist
            const destDir = path.dirname(destinationPath);
            await this.createDirectory(destDir);

            await fs.promises.rename(sourcePath, destinationPath);
            this.logger.info(`File moved: ${sourcePath} -> ${destinationPath}`);
        } catch (error) {
            this.logger.error(`Failed to move file: ${sourcePath} -> ${destinationPath}`, error);
            throw error;
        }
    }


    /**
     * Get file name with extension
     */
    static getFileName(filePath: string): string {
        this.logger.debug(`Getting file name: ${filePath}`);

        const name = path.basename(filePath);
        this.logger.info(`File name: ${name}`);
        return name;
    }

    /**
     * Get directory name
     */
    static getDirectoryName(filePath: string): string {
        this.logger.debug(`Getting directory name: ${filePath}`);

        const dirName = path.dirname(filePath);
        this.logger.info(`Directory name: ${dirName}`);
        return dirName;
    }
}

