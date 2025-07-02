import React, { useState, useEffect } from 'react';
import { CaseSensitiveManager, type CaseSensitiveFileEntry } from '../../security/caseSensitiveManager';
import { SymmetricCrypto } from '../../security/symmetricEncryption';
import { FileText, Lock, Unlock, Key, Download, Upload, RefreshCw, AlertTriangle, CheckCircle, Settings, Archive, Search, Filter, Eye, EyeOff } from 'lucide-react';

interface CaseSensitiveDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaseSensitiveDashboard: React.FC<CaseSensitiveDashboardProps> = ({ isOpen, onClose }) => {
  const [encryptedFiles, setEncryptedFiles] = useState<CaseSensitiveFileEntry[]>([]);
  const [stats, setStats] = useState<any>({});
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'backup' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCaseSensitiveOnly, setShowCaseSensitiveOnly] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      await CaseSensitiveManager.initialize();
      const files = CaseSensitiveManager.getEncryptedFiles();
      const statistics = CaseSensitiveManager.getStatistics();
      
      setEncryptedFiles(files);
      setStats(statistics);
    } catch (error) {
      console.error('Failed to load case-sensitive data:', error);
    }
  };

  const handleEncryptSampleFiles = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sample case-sensitive files
      const sampleFiles = {
        '.env': `# Case-Sensitive Environment Variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_ENABLE_SECURITY_LOGGING=true
DATABASE_URL=postgresql://user:pass@localhost:5432/db`,
        'package.json': JSON.stringify({
          "name": "autosense-pro",
          "version": "1.0.0",
          "type": "module",
          "scripts": {
            "dev": "vite",
            "build": "tsc -b && vite build"
          },
          "dependencies": {
            "react": "^19.1.0",
            "@supabase/supabase-js": "^2.39.0"
          }
        }, null, 2),
        'tsconfig.json': JSON.stringify({
          "compilerOptions": {
            "target": "ES2022",
            "lib": ["ES2022", "DOM", "DOM.Iterable"],
            "module": "ESNext",
            "skipLibCheck": true,
            "moduleResolution": "bundler",
            "allowImportingTsExtensions": true,
            "verbatimModuleSyntax": true,
            "moduleDetection": "force",
            "noEmit": true,
            "jsx": "react-jsx",
            "strict": true,
            "noUnusedLocals": true,
            "noUnusedParameters": true
          },
          "include": ["src"]
        }, null, 2),
        'README.md': `# AutoSense Pro

## Case-Sensitive Configuration

This project uses case-sensitive file encryption to protect:

- Environment variables (.env files)
- Configuration files (package.json, tsconfig.json)
- Documentation (README.md, LICENSE)
- Build configurations (vite.config.ts, tailwind.config.js)

### Security Features

- **Symmetric Encryption**: Fast AES-GCM encryption for configuration files
- **Case Preservation**: Maintains exact case sensitivity for critical files
- **Integrity Verification**: SHA-256 checksums ensure file integrity
- **Secure Backups**: Encrypted backups with case mapping preservation

### Usage

1. Initialize encryption with a strong password
2. Encrypt critical configuration files
3. Create regular encrypted backups
4. Verify file integrity periodically
`
      };

      await CaseSensitiveManager.encryptAllCriticalFiles(sampleFiles, password);
      
      setSuccess('Sample case-sensitive files encrypted successfully');
      await loadData();
    } catch (error) {
      setError(`Failed to encrypt files: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    if (!password) {
      setError('Password is required for backup');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { backupId, encryptedBackup, manifest } = await CaseSensitiveManager.createSecureBackup(password);
      
      // Download backup file
      const backupData = {
        id: backupId,
        timestamp: Date.now(),
        encryptedBackup,
        manifest
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `case-sensitive-backup-${backupId}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setSuccess('Case-sensitive backup created and downloaded successfully');
      await loadData();
    } catch (error) {
      setError(`Failed to create backup: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFiles = async () => {
    if (!password) {
      setError('Password is required for verification');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const verification = await CaseSensitiveManager.verifyAllFiles(password);
      
      if (verification.invalid.length > 0 || verification.errors.length > 0) {
        setError(`Verification failed: ${verification.invalid.length} invalid files, ${verification.caseMismatches.length} case mismatches, ${verification.errors.length} errors`);
      } else {
        setSuccess(`All ${verification.valid.length} files verified successfully`);
      }
    } catch (error) {
      setError(`Verification failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDecryptFile = async (fileId: string) => {
    if (!password) {
      setError('Password is required for decryption');
      return;
    }

    try {
      const { content, fileName, caseSensitive } = await CaseSensitiveManager.decryptFile(fileId, password);
      
      // Download decrypted file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `decrypted_${fileName}`;
      a.click();
      URL.revokeObjectURL(url);

      setSuccess(`File ${fileName} decrypted and downloaded`);
    } catch (error) {
      setError(`Failed to decrypt file: ${error}`);
    }
  };

  const filteredFiles = encryptedFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCaseSensitive = !showCaseSensitiveOnly || file.caseSensitive;
    return matchesSearch && matchesCaseSensitive;
  });

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-6 w-6 mr-3" />
              <h2 className="text-xl font-semibold">Case-Sensitive File Encryption</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <span className="sr-only">Close</span>
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'files', label: 'Encrypted Files', icon: Lock },
              { id: 'backup', label: 'Backup & Restore', icon: Archive },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <p className="text-green-800">{success}</p>
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Encryption Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter encryption password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              {encryptedFiles.length === 0 && (
                <button
                  onClick={handleEncryptSampleFiles}
                  disabled={loading || !password}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Encrypting...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Encrypt Sample Files
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-green-600">Total Files</p>
                      <p className="text-2xl font-bold text-green-900">{stats.totalFiles || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Lock className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-blue-600">Case-Sensitive</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.caseSensitiveFiles || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Archive className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm text-purple-600">Total Size</p>
                      <p className="text-2xl font-bold text-purple-900">{formatFileSize(stats.totalSize || 0)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Key className="h-8 w-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm text-orange-600">Critical Files</p>
                      <p className="text-2xl font-bold text-orange-900">{stats.criticalFilesEncrypted || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleCreateBackup}
                    disabled={loading || !password || encryptedFiles.length === 0}
                    className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Create Backup
                  </button>

                  <button
                    onClick={handleVerifyFiles}
                    disabled={loading || !password || encryptedFiles.length === 0}
                    className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Verify Files
                  </button>

                  <button
                    onClick={loadData}
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Encryption Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Encryption Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Algorithm</span>
                      <span className="font-medium text-gray-900">AES-GCM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Key Length</span>
                      <span className="font-medium text-gray-900">256 bits</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Key Derivation</span>
                      <span className="font-medium text-gray-900">PBKDF2</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Iterations</span>
                      <span className="font-medium text-gray-900">100,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Case Preservation</span>
                      <span className="font-medium text-green-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Integrity Check</span>
                      <span className="font-medium text-green-600">SHA-256</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showCaseSensitiveOnly}
                    onChange={(e) => setShowCaseSensitiveOnly(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-2"
                  />
                  <span className="text-sm text-gray-700">Case-sensitive only</span>
                </label>
              </div>

              {/* Files List */}
              {filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No encrypted files found.</p>
                  {encryptedFiles.length === 0 && (
                    <p className="text-sm mt-2">Use the "Encrypt Sample Files" button to get started.</p>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          File Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Case Sensitive
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Modified
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Lock className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm font-medium text-gray-900">{file.fileName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              file.caseSensitive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {file.caseSensitive ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(file.lastModified)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleDecryptFile(file.id)}
                              disabled={!password}
                              className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 mr-3"
                              title="Decrypt and download"
                            >
                              <Unlock className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => CaseSensitiveManager.removeFile(file.id).then(loadData)}
                              className="text-red-600 hover:text-red-700"
                              title="Remove file"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Backup & Restore</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Create Backup</h4>
                  <p className="text-green-700 mb-4">
                    Create an encrypted backup of all case-sensitive files with case mapping preservation.
                  </p>
                  <button
                    onClick={handleCreateBackup}
                    disabled={loading || !password || encryptedFiles.length === 0}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Create & Download Backup
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">Restore from Backup</h4>
                  <p className="text-blue-700 mb-4">
                    Restore case-sensitive files from a previously created backup.
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    className="w-full mb-3 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <button
                    disabled={loading || !password}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Restore from Backup
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Case-Sensitive Settings</h3>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">File Management</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Auto-Encrypt Critical Files</h5>
                      <p className="text-sm text-gray-600">Automatically encrypt files that are case-sensitive</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Compression</h5>
                      <p className="text-sm text-gray-600">Enable compression before encryption</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Verify File Integrity</h5>
                      <p className="text-sm text-gray-600">Check integrity of all encrypted files</p>
                    </div>
                    <button
                      onClick={handleVerifyFiles}
                      disabled={!password || loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                      Verify All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};