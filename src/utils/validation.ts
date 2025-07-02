// Enhanced input validation utilities
import { SecurityUtils } from './security';

export const sanitizeInput = (input: string): string => {
  return SecurityUtils.sanitizeInput(input);
};

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  // Trim whitespace
  const trimmedEmail = email.trim();
  
  // Basic length checks
  if (trimmedEmail.length < 3 || trimmedEmail.length > 254) return false;
  
  // More permissive email regex that handles most valid email formats
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Check basic format
  if (!emailRegex.test(trimmedEmail)) return false;
  
  // Additional checks
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) return false;
  
  const [localPart, domainPart] = parts;
  
  // Local part checks
  if (localPart.length === 0 || localPart.length > 64) return false;
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
  if (localPart.includes('..')) return false;
  
  // Domain part checks
  if (domainPart.length === 0 || domainPart.length > 253) return false;
  if (domainPart.startsWith('-') || domainPart.endsWith('-')) return false;
  if (domainPart.startsWith('.') || domainPart.endsWith('.')) return false;
  if (!domainPart.includes('.')) return false;
  
  return true;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  return SecurityUtils.validatePassword(password);
};

export const validateCarYear = (year: string): boolean => {
  if (!year || typeof year !== 'string') return false;
  
  const yearNum = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  return !isNaN(yearNum) && yearNum >= 1990 && yearNum <= currentYear + 1;
};

export const validateOBDData = (data: any): boolean => {
  // Validate OBD data structure and ranges
  if (typeof data !== 'object' || data === null) return false;
  
  // Check for required fields
  if (!Array.isArray(data.diagnosticTroubleCodes)) return false;
  if (typeof data.readinessMonitors !== 'object') return false;
  
  // Validate numeric ranges with proper bounds checking
  const numericFields = [
    { field: 'engineRPM', min: 0, max: 10000 },
    { field: 'vehicleSpeed', min: 0, max: 300 },
    { field: 'engineLoad', min: 0, max: 100 },
    { field: 'coolantTemp', min: -40, max: 150 },
    { field: 'intakeTemp', min: -40, max: 100 },
    { field: 'fuelPressure', min: 0, max: 100 },
    { field: 'throttlePosition', min: 0, max: 100 },
    { field: 'oxygenSensor', min: 0, max: 5 },
    { field: 'fuelTrim', min: -50, max: 50 }
  ];

  for (const { field, min, max } of numericFields) {
    if (data[field] !== undefined) {
      const value = Number(data[field]);
      if (isNaN(value) || value < min || value > max) {
        return false;
      }
    }
  }

  // Validate diagnostic trouble codes format
  if (data.diagnosticTroubleCodes.length > 0) {
    const dtcRegex = /^[PBCU][0-9A-F]{4}$/i;
    for (const code of data.diagnosticTroubleCodes) {
      if (typeof code !== 'string' || !dtcRegex.test(code)) {
        return false;
      }
    }
  }
  
  return true;
};

export const sanitizeSearchQuery = (query: string): string => {
  if (!query || typeof query !== 'string') return '';
  
  return query
    .replace(/[^\w\s-]/g, '') // Only allow alphanumeric, spaces, and hyphens
    .substring(0, 100) // Limit length
    .trim();
};

// Validate car make/model inputs
export const validateCarField = (field: string): boolean => {
  if (!field || typeof field !== 'string') return false;
  
  const sanitized = field.trim();
  return sanitized.length >= 1 && 
         sanitized.length <= 50 && 
         /^[a-zA-Z0-9\s-]+$/.test(sanitized);
};

// Validate post content
export const validatePostContent = (content: string, maxLength: number = 1000): { isValid: boolean; error?: string } => {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: 'Content is required' };
  }

  const trimmed = content.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Content cannot be empty' };
  }

  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Content must be ${maxLength} characters or less` };
  }

  // Check for potential spam patterns
  const spamPatterns = [
    /(.)\1{10,}/, // Repeated characters
    /https?:\/\/[^\s]+/gi, // Multiple URLs (basic check)
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: 'Content appears to be spam' };
    }
  }

  return { isValid: true };
};