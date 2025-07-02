// Case-Sensitive File Manager
import { SymmetricCrypto, type SymmetricEncryptedData } from './symmetricEncryption';

export interface CaseSensitiveFileEntry {
  id: string;
  fileName: string;
  originalPath: string;
  encryptedData: SymmetricEncryptedData;
  checksum: string;
  lastModified: number;
  caseSensitive: boolean;
  size: number;
}

export interface CaseSensitiveConfig {
  autoEncrypt: boolean;
  compressionEnabled: boolean;
  backupInterval: number; // hours
  maxFileSize: number; // bytes
  allowedExtensions: string[];
}

export class CaseSensitiveFileManager {
  private static instance: CaseSensitiveFileManager;
  private encryptedFiles: Map<string, CaseSensitiveFileEntry> = new Map();
  private config: CaseSensitiveConfig;

  // Critical case-sensitive files that must be encrypted
  private readonly CRITICAL_FILES = [
    '.env',
    '.env.local',
    '.env.production',
    '.env.development',
    '.env.test',
    'package.json',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'vite.config.ts',
    'tailwind.config.js',
    'postcss.config.js',
    'eslint.config.js',
    'README.md',
    'LICENSE',
    'Dockerfile',
    'docker-compose.yml',
    'docker-compose.yaml',
    '.gitignore',
    '.gitattributes',
    'Makefile',
    'makefile'
  ];

  private constructor() {
    this.config = {
      autoEncrypt: true,
      compressionEnabled: true,
      backupInterval: 24, // 24 hours
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedExtensions: [
        '.env', '.json', '.js', '.ts', '.md', '.txt', '.yml', '.yaml',
        '.toml', '.ini', '.conf', '.properties', '.sql', '.sh', '.bat',
        '.cmd', '.ps1', '.xml', '.plist', '.gradle', '.mk'
      ]
    };
  }

  public static getInstance(): CaseSensitiveFileManager {
    if (!CaseSensitiveFileManager.instance) {
      CaseSensitiveFileManager.instance = new CaseSensitiveFileManager();
    }
    return CaseSensitiveFileManager.instance;
  }

  /**
   * Initialize the case-sensitive file manager
   */
  public async initialize(): Promise<void> {
    try {
      await this.loadEncryptedFilesRegistry();
      console.log('Case-sensitive file manager initialized');
    } catch (error) {
      console.warn('Failed to initialize case-sensitive file manager:', error);
    }
  }

  /**
   * Check if a file should be treated as case-sensitive
   */
  public isCaseSensitiveFile(fileName: string): boolean {
    // Check if it's in critical files list
    if (this.CRITICAL_FILES.includes(fileName)) {
      return true;
    }

    // Check by extension
    const extension = this.getFileExtension(fileName);
    return this.config.allowedExtensions.includes(extension);
  }

  /**
   * Encrypt a case-sensitive file
   */
  public async encryptFile(
    fileName: string,
    content: string,
    password: string
  ): Promise<CaseSensitiveFileEntry> {
    try {
      // Validate file
      this.validateFile(fileName, content);

      const fileId = this.generateFileId(fileName);
      const checksum = await SymmetricCrypto.hashCaseSensitiveContent(content, true);

      // Encrypt the content
      const encryptedData = await SymmetricCrypto.encryptCaseSensitive(
        content,
        password,
        fileName
      );

      const fileEntry: CaseSensitiveFileEntry = {
        id: fileId,
        fileName,
        originalPath: fileName,
        encryptedData,
        checksum,
        lastModified: Date.now(),
        caseSensitive: SymmetricCrypto.isCaseSensitiveFile(fileName),
        size: content.length
      };

      this.encryptedFiles.set(fileId, fileEntry);
      await this.saveEncryptedFilesRegistry();

      console.log(`Case-sensitive file encrypted: ${fileName}`);
      return fileEntry;
    } catch (error) {
      throw new Error(`Failed to encrypt case-sensitive file ${fileName}: ${error}`);
    }
  }

  /**
   * Decrypt a case-sensitive file
   */
  public async decryptFile(fileId: string, password: string): Promise<{
    content: string;
    fileName: string;
    caseSensitive: boolean;
  }> {
    const fileEntry = this.encryptedFiles.get(fileId);
    if (!fileEntry) {
      throw new Error(`File not found: ${fileId}`);
    }

    try {
      const content = await SymmetricCrypto.decryptCaseSensitive(
        fileEntry.encryptedData,
        password
      );

      // Verify integrity
      const currentChecksum = await SymmetricCrypto.hashCaseSensitiveContent(content, true);
      if (currentChecksum !== fileEntry.checksum) {
        throw new Error('File integrity check failed - content may be corrupted');
      }

      console.log(`Case-sensitive file decrypted: ${fileEntry.fileName}`);
      return {
        content,
        fileName: fileEntry.fileName,
        caseSensitive: fileEntry.caseSensitive
      };
    } catch (error) {
      throw new Error(`Failed to decrypt file ${fileId}: ${error}`);
    }
  }

  /**
   * Encrypt all critical case-sensitive files
   */
  public async encryptAllCriticalFiles(
    fileContents: Record<string, string>,
    password: string
  ): Promise<CaseSensitiveFileEntry[]> {
    const encryptedFiles: CaseSensitiveFileEntry[] = [];

    for (const fileName of this.CRITICAL_FILES) {
      if (fileContents[fileName]) {
        try {
          const fileEntry = await this.encryptFile(fileName, fileContents[fileName], password);
          encryptedFiles.push(fileEntry);
        } catch (error) {
          console.warn(`Failed to encrypt critical file ${fileName}:`, error);
        }
      }
    }

    return encryptedFiles;
  }

  /**
   * Create secure backup of case-sensitive files
   */
  public async createSecureBackup(password: string): Promise<{
    backupId: string;
    encryptedBackup: SymmetricEncryptedData;
    manifest: Array<{ fileName: string; caseSensitive: boolean; size: number }>;
  }> {
    const files = Array.from(this.encryptedFiles.values()).map(entry => ({
      fileName: entry.fileName,
      content: JSON.stringify(entry)
    }));

    return SymmetricCrypto.createCaseSensitiveBackup(files, password);
  }

  /**
   * Restore from secure backup
   */
  public async restoreFromBackup(
    encryptedBackup: SymmetricEncryptedData,
    password: string
  ): Promise<CaseSensitiveFileEntry[]> {
    try {
      const restoredFiles = await SymmetricCrypto.restoreFromCaseSensitiveBackup(
        encryptedBackup,
        password
      );

      const fileEntries: CaseSensitiveFileEntry[] = [];

      for (const file of restoredFiles) {
        try {
          const fileEntry: CaseSensitiveFileEntry = JSON.parse(file.content);
          this.encryptedFiles.set(fileEntry.id, fileEntry);
          fileEntries.push(fileEntry);
        } catch (error) {
          console.warn(`Failed to restore file ${file.fileName}:`, error);
        }
      }

      await this.saveEncryptedFilesRegistry();
      console.log(`Restored ${fileEntries.length} case-sensitive files from backup`);

      return fileEntries;
    } catch (error) {
      throw new Error(`Failed to restore from backup: ${error}`);
    }
  }

  /**
   * Verify integrity of all case-sensitive files
   */
  public async verifyAllFiles(password: string): Promise<{
    valid: string[];
    invalid: string[];
    caseMismatches: string[];
    errors: Array<{ fileId: string; fileName: string; error: string }>;
  }> {
    const valid: string[] = [];
    const invalid: string[] = [];
    const caseMismatches: string[] = [];
    const errors: Array<{ fileId: string; fileName: string; error: string }> = [];

    for (const [fileId, fileEntry] of this.encryptedFiles) {
      try {
        const decryptedContent = await SymmetricCrypto.decryptCaseSensitive(
          fileEntry.encryptedData,
          password
        );

        const currentChecksum = await SymmetricCrypto.hashCaseSensitiveContent(decryptedContent, true);
        
        if (currentChecksum === fileEntry.checksum) {
          valid.push(fileId);
        } else {
          // Check if it's a case mismatch
          const caseInsensitiveChecksum = await SymmetricCrypto.hashCaseSensitiveContent(decryptedContent, false);
          const originalCaseInsensitive = await SymmetricCrypto.hashCaseSensitiveContent(
            await SymmetricCrypto.decryptCaseSensitive(fileEntry.encryptedData, password),
            false
          );

          if (caseInsensitiveChecksum === originalCaseInsensitive) {
            caseMismatches.push(fileId);
          } else {
            invalid.push(fileId);
          }
        }
      } catch (error) {
        errors.push({
          fileId,
          fileName: fileEntry.fileName,
          error: String(error)
        });
      }
    }

    return { valid, invalid, caseMismatches, errors };
  }

  /**
   * Get statistics about encrypted files
   */
  public getStatistics(): {
    totalFiles: number;
    caseSensitiveFiles: number;
    totalSize: number;
    encryptedSize: number;
    compressionRatio: number;
    lastBackup: number | null;
    criticalFilesEncrypted: number;
  } {
    let totalSize = 0;
    let encryptedSize = 0;
    let caseSensitiveCount = 0;
    let criticalFilesCount = 0;

    for (const fileEntry of this.encryptedFiles.values()) {
      totalSize += fileEntry.size;
      encryptedSize += fileEntry.encryptedData.encryptedContent.length;
      
      if (fileEntry.caseSensitive) {
        caseSensitiveCount++;
      }

      if (this.CRITICAL_FILES.includes(fileEntry.fileName)) {
        criticalFilesCount++;
      }
    }

    const compressionRatio = totalSize > 0 ? encryptedSize / totalSize : 1;
    const lastBackup = this.getLastBackupTime();

    return {
      totalFiles: this.encryptedFiles.size,
      caseSensitiveFiles: caseSensitiveCount,
      totalSize,
      encryptedSize,
      compressionRatio,
      lastBackup,
      criticalFilesEncrypted: criticalFilesCount
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<CaseSensitiveConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('case_sensitive_config', JSON.stringify(this.config));
  }

  /**
   * Get configuration
   */
  public getConfig(): CaseSensitiveConfig {
    return { ...this.config };
  }

  /**
   * Get list of encrypted files
   */
  public getEncryptedFiles(): CaseSensitiveFileEntry[] {
    return Array.from(this.encryptedFiles.values());
  }

  /**
   * Remove encrypted file
   */
  public async removeFile(fileId: string): Promise<void> {
    if (this.encryptedFiles.has(fileId)) {
      const fileEntry = this.encryptedFiles.get(fileId)!;
      this.encryptedFiles.delete(fileId);
      await this.saveEncryptedFilesRegistry();
      console.log(`Removed case-sensitive file: ${fileEntry.fileName}`);
    }
  }

  /**
   * Search encrypted files
   */
  public searchFiles(query: string): CaseSensitiveFileEntry[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.encryptedFiles.values()).filter(entry =>
      entry.fileName.toLowerCase().includes(lowerQuery) ||
      entry.originalPath.toLowerCase().includes(lowerQuery)
    );
  }

  // Private helper methods
  private validateFile(fileName: string, content: string): void {
    if (!fileName || fileName.trim().length === 0) {
      throw new Error('File name is required');
    }

    if (content.length > this.config.maxFileSize) {
      throw new Error(`File size exceeds maximum allowed size of ${this.config.maxFileSize} bytes`);
    }

    const extension = this.getFileExtension(fileName);
    if (!this.config.allowedExtensions.includes(extension) && !this.CRITICAL_FILES.includes(fileName)) {
      throw new Error(`File extension ${extension} is not allowed for encryption`);
    }
  }

  private getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot === -1 ? '' : fileName.substring(lastDot);
  }

  private generateFileId(fileName: string): string {
    return 'cs_' + btoa(fileName + Date.now()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  private async loadEncryptedFilesRegistry(): Promise<void> {
    try {
      const registryData = localStorage.getItem('case_sensitive_files_registry');
      if (registryData) {
        const registry = JSON.parse(registryData);
        this.encryptedFiles = new Map(Object.entries(registry));
      }

      // Load configuration
      const configData = localStorage.getItem('case_sensitive_config');
      if (configData) {
        this.config = { ...this.config, ...JSON.parse(configData) };
      }
    } catch (error) {
      console.warn('Failed to load case-sensitive files registry:', error);
    }
  }

  private async saveEncryptedFilesRegistry(): Promise<void> {
    try {
      const registry = Object.fromEntries(this.encryptedFiles);
      localStorage.setItem('case_sensitive_files_registry', JSON.stringify(registry));
    } catch (error) {
      console.warn('Failed to save case-sensitive files registry:', error);
    }
  }

  private getLastBackupTime(): number | null {
    try {
      const backupKeys = Object.keys(localStorage).filter(key => key.startsWith('cs_backup_'));
      if (backupKeys.length === 0) return null;

      let latestBackup = 0;
      for (const key of backupKeys) {
        const backupData = JSON.parse(localStorage.getItem(key) || '{}');
        if (backupData.timestamp > latestBackup) {
          latestBackup = backupData.timestamp;
        }
      }

      return latestBackup || null;
    } catch {
      return null;
    }
  }
}

// Singleton instance
export const CaseSensitiveManager = CaseSensitiveFileManager.getInstance();