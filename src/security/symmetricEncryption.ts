// Symmetric Encryption Implementation for Case-Sensitive Files
export interface SymmetricEncryptedData {
  encryptedContent: string;
  iv: string;
  salt: string;
  timestamp: number;
  algorithm: string;
  caseSensitive: boolean;
  originalCase?: string; // Stores original case mapping
}

export interface CaseSensitiveFile {
  id: string;
  fileName: string;
  originalPath: string;
  content: string;
  caseMappings: Array<{
    position: number;
    originalChar: string;
    normalizedChar: string;
  }>;
  checksum: string;
  lastModified: number;
}

export class SymmetricEncryption {
  private static instance: SymmetricEncryption;
  private readonly ALGORITHM = 'AES-GCM';
  private readonly KEY_LENGTH = 256;
  private readonly IV_LENGTH = 12;
  private readonly SALT_LENGTH = 16;
  private readonly ITERATIONS = 100000;

  // Case-sensitive file patterns
  private readonly CASE_SENSITIVE_PATTERNS = [
    /\.env(\.|$)/i,
    /\.env\.(local|development|production|test)$/i,
    /config\.(js|ts|json)$/i,
    /\.config\.(js|ts)$/i,
    /package\.json$/i,
    /tsconfig.*\.json$/i,
    /\.gitignore$/i,
    /README\.md$/i,
    /LICENSE$/i,
    /Dockerfile$/i,
    /docker-compose\.ya?ml$/i,
    /\.ya?ml$/i,
    /\.toml$/i,
    /\.ini$/i,
    /\.conf$/i,
    /\.properties$/i,
    /\.sql$/i,
    /\.sh$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.ps1$/i,
    /Makefile$/i,
    /\.mk$/i,
    /\.gradle$/i,
    /\.xml$/i,
    /\.plist$/i
  ];

  private constructor() {}

  public static getInstance(): SymmetricEncryption {
    if (!SymmetricEncryption.instance) {
      SymmetricEncryption.instance = new SymmetricEncryption();
    }
    return SymmetricEncryption.instance;
  }

  /**
   * Check if a file should be treated as case-sensitive
   */
  public isCaseSensitiveFile(fileName: string): boolean {
    return this.CASE_SENSITIVE_PATTERNS.some(pattern => pattern.test(fileName));
  }

  /**
   * Generate encryption key from password with salt
   */
  private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    // Import password as key material
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    );

    // Derive AES key using PBKDF2
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: this.ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Analyze case sensitivity in content
   */
  private analyzeCaseSensitivity(content: string): {
    caseMappings: Array<{
      position: number;
      originalChar: string;
      normalizedChar: string;
    }>;
    normalizedContent: string;
  } {
    const caseMappings: Array<{
      position: number;
      originalChar: string;
      normalizedChar: string;
    }> = [];

    let normalizedContent = '';

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      const normalizedChar = char.toLowerCase();

      if (char !== normalizedChar) {
        caseMappings.push({
          position: i,
          originalChar: char,
          normalizedChar: normalizedChar
        });
      }

      normalizedContent += normalizedChar;
    }

    return { caseMappings, normalizedContent };
  }

  /**
   * Restore original case from mappings
   */
  private restoreCase(normalizedContent: string, caseMappings: Array<{
    position: number;
    originalChar: string;
    normalizedChar: string;
  }>): string {
    let restoredContent = normalizedContent;

    // Apply case mappings in reverse order to maintain positions
    for (let i = caseMappings.length - 1; i >= 0; i--) {
      const mapping = caseMappings[i];
      if (mapping.position < restoredContent.length) {
        restoredContent = 
          restoredContent.substring(0, mapping.position) +
          mapping.originalChar +
          restoredContent.substring(mapping.position + 1);
      }
    }

    return restoredContent;
  }

  /**
   * Encrypt content with case sensitivity preservation
   */
  public async encryptCaseSensitive(
    content: string,
    password: string,
    fileName: string
  ): Promise<SymmetricEncryptedData> {
    try {
      const isCaseSensitive = this.isCaseSensitiveFile(fileName);
      let processedContent = content;
      let caseMappings: any[] = [];

      // Analyze case sensitivity if needed
      if (isCaseSensitive) {
        const analysis = this.analyzeCaseSensitivity(content);
        caseMappings = analysis.caseMappings;
        processedContent = analysis.normalizedContent;
      }

      // Generate salt and IV
      const salt = window.crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
      const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));

      // Derive encryption key
      const key = await this.deriveKey(password, salt);

      // Prepare data for encryption
      const dataToEncrypt = {
        content: processedContent,
        caseMappings: isCaseSensitive ? caseMappings : [],
        fileName,
        timestamp: Date.now()
      };

      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(JSON.stringify(dataToEncrypt));

      // Encrypt the data
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv
        },
        key,
        dataBuffer
      );

      // Convert to base64 for storage
      const encryptedData: SymmetricEncryptedData = {
        encryptedContent: this.arrayBufferToBase64(encryptedBuffer),
        iv: this.arrayBufferToBase64(iv),
        salt: this.arrayBufferToBase64(salt),
        timestamp: Date.now(),
        algorithm: this.ALGORITHM,
        caseSensitive: isCaseSensitive,
        originalCase: isCaseSensitive ? JSON.stringify(caseMappings) : undefined
      };

      this.logEncryptionEvent('encrypt', fileName, isCaseSensitive);
      return encryptedData;
    } catch (error) {
      throw new Error(`Failed to encrypt case-sensitive content: ${error}`);
    }
  }

  /**
   * Decrypt content with case sensitivity restoration
   */
  public async decryptCaseSensitive(
    encryptedData: SymmetricEncryptedData,
    password: string
  ): Promise<string> {
    try {
      // Convert from base64
      const encryptedBuffer = this.base64ToArrayBuffer(encryptedData.encryptedContent);
      const iv = this.base64ToArrayBuffer(encryptedData.iv);
      const salt = this.base64ToArrayBuffer(encryptedData.salt);

      // Derive decryption key
      const key = await this.deriveKey(password, salt);

      // Decrypt the data
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: iv
        },
        key,
        encryptedBuffer
      );

      // Parse decrypted data
      const decoder = new TextDecoder();
      const decryptedString = decoder.decode(decryptedBuffer);
      const decryptedData = JSON.parse(decryptedString);

      let restoredContent = decryptedData.content;

      // Restore case sensitivity if applicable
      if (encryptedData.caseSensitive && decryptedData.caseMappings) {
        restoredContent = this.restoreCase(decryptedData.content, decryptedData.caseMappings);
      }

      this.logEncryptionEvent('decrypt', decryptedData.fileName, encryptedData.caseSensitive);
      return restoredContent;
    } catch (error) {
      throw new Error(`Failed to decrypt case-sensitive content: ${error}`);
    }
  }

  /**
   * Encrypt multiple case-sensitive files
   */
  public async encryptCaseSensitiveFiles(
    files: Array<{ fileName: string; content: string }>,
    password: string
  ): Promise<Array<{ fileName: string; encryptedData: SymmetricEncryptedData }>> {
    const results: Array<{ fileName: string; encryptedData: SymmetricEncryptedData }> = [];

    for (const file of files) {
      try {
        const encryptedData = await this.encryptCaseSensitive(
          file.content,
          password,
          file.fileName
        );
        results.push({ fileName: file.fileName, encryptedData });
      } catch (error) {
        console.warn(`Failed to encrypt ${file.fileName}:`, error);
      }
    }

    return results;
  }

  /**
   * Create case-sensitive file backup
   */
  public async createCaseSensitiveBackup(
    files: Array<{ fileName: string; content: string }>,
    password: string
  ): Promise<{
    backupId: string;
    encryptedBackup: SymmetricEncryptedData;
    manifest: Array<{ fileName: string; caseSensitive: boolean; size: number }>;
  }> {
    const backupId = this.generateBackupId();
    const manifest: Array<{ fileName: string; caseSensitive: boolean; size: number }> = [];

    // Prepare backup data
    const backupData = {
      id: backupId,
      timestamp: Date.now(),
      files: {} as Record<string, any>
    };

    for (const file of files) {
      const isCaseSensitive = this.isCaseSensitiveFile(file.fileName);
      
      if (isCaseSensitive) {
        const analysis = this.analyzeCaseSensitivity(file.content);
        backupData.files[file.fileName] = {
          content: file.content,
          caseMappings: analysis.caseMappings,
          caseSensitive: true
        };
      } else {
        backupData.files[file.fileName] = {
          content: file.content,
          caseSensitive: false
        };
      }

      manifest.push({
        fileName: file.fileName,
        caseSensitive: isCaseSensitive,
        size: file.content.length
      });
    }

    // Encrypt the entire backup
    const encryptedBackup = await this.encryptCaseSensitive(
      JSON.stringify(backupData),
      password,
      `backup-${backupId}.json`
    );

    return { backupId, encryptedBackup, manifest };
  }

  /**
   * Restore from case-sensitive backup
   */
  public async restoreFromCaseSensitiveBackup(
    encryptedBackup: SymmetricEncryptedData,
    password: string
  ): Promise<Array<{ fileName: string; content: string; caseSensitive: boolean }>> {
    try {
      const backupString = await this.decryptCaseSensitive(encryptedBackup, password);
      const backupData = JSON.parse(backupString);

      const restoredFiles: Array<{ fileName: string; content: string; caseSensitive: boolean }> = [];

      for (const [fileName, fileData] of Object.entries(backupData.files)) {
        const data = fileData as any;
        let content = data.content;

        // Restore case if needed
        if (data.caseSensitive && data.caseMappings) {
          content = this.restoreCase(content, data.caseMappings);
        }

        restoredFiles.push({
          fileName,
          content,
          caseSensitive: data.caseSensitive
        });
      }

      return restoredFiles;
    } catch (error) {
      throw new Error(`Failed to restore from backup: ${error}`);
    }
  }

  /**
   * Verify case-sensitive file integrity
   */
  public async verifyCaseSensitiveFile(
    originalContent: string,
    encryptedData: SymmetricEncryptedData,
    password: string
  ): Promise<{ isValid: boolean; caseMismatch?: boolean; error?: string }> {
    try {
      const decryptedContent = await this.decryptCaseSensitive(encryptedData, password);
      
      if (decryptedContent === originalContent) {
        return { isValid: true };
      }

      // Check if it's just a case mismatch
      if (decryptedContent.toLowerCase() === originalContent.toLowerCase()) {
        return { isValid: false, caseMismatch: true };
      }

      return { isValid: false };
    } catch (error) {
      return { isValid: false, error: String(error) };
    }
  }

  /**
   * Generate secure hash for case-sensitive content
   */
  public async hashCaseSensitiveContent(content: string, preserveCase: boolean = true): Promise<string> {
    const encoder = new TextEncoder();
    const contentToHash = preserveCase ? content : content.toLowerCase();
    const data = encoder.encode(contentToHash);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return this.arrayBufferToBase64(hashBuffer);
  }

  /**
   * Compress content before encryption (optional)
   */
  private async compressContent(content: string): Promise<string> {
    try {
      // Use built-in compression if available
      if ('CompressionStream' in window) {
        const stream = new CompressionStream('gzip');
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();

        const encoder = new TextEncoder();
        writer.write(encoder.encode(content));
        writer.close();

        const chunks: Uint8Array[] = [];
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) chunks.push(value);
        }

        const compressedArray = new Uint8Array(
          chunks.reduce((acc, chunk) => acc + chunk.length, 0)
        );
        let offset = 0;
        for (const chunk of chunks) {
          compressedArray.set(chunk, offset);
          offset += chunk.length;
        }

        return this.arrayBufferToBase64(compressedArray.buffer);
      }
    } catch (error) {
      console.warn('Compression failed, using original content:', error);
    }

    return content;
  }

  /**
   * Decompress content after decryption (optional)
   */
  private async decompressContent(compressedContent: string): Promise<string> {
    try {
      if ('DecompressionStream' in window) {
        const compressedArray = this.base64ToArrayBuffer(compressedContent);
        const stream = new DecompressionStream('gzip');
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();

        writer.write(compressedArray);
        writer.close();

        const chunks: Uint8Array[] = [];
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) chunks.push(value);
        }

        const decompressedArray = new Uint8Array(
          chunks.reduce((acc, chunk) => acc + chunk.length, 0)
        );
        let offset = 0;
        for (const chunk of chunks) {
          decompressedArray.set(chunk, offset);
          offset += chunk.length;
        }

        const decoder = new TextDecoder();
        return decoder.decode(decompressedArray);
      }
    } catch (error) {
      console.warn('Decompression failed, treating as uncompressed:', error);
    }

    return compressedContent;
  }

  // Helper methods
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private generateBackupId(): string {
    return 'cs_backup_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
  }

  private logEncryptionEvent(operation: 'encrypt' | 'decrypt', fileName: string, caseSensitive: boolean): void {
    if (import.meta.env.VITE_ENABLE_SECURITY_LOGGING === 'true') {
      console.log(`Symmetric ${operation} (case-sensitive: ${caseSensitive}):`, {
        fileName,
        timestamp: new Date().toISOString(),
        algorithm: this.ALGORITHM,
        caseSensitive
      });
    }
  }
}

// Singleton instance
export const SymmetricCrypto = SymmetricEncryption.getInstance();