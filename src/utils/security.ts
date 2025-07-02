// Enhanced Security utilities with WAF integration
import { WAF } from '../security/waf';

export class SecurityUtils {
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private static loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

  // Input sanitization with WAF integration
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    // First pass through WAF
    const wafResult = WAF.scanInput(input, 'sanitization');
    
    if (wafResult.isBlocked) {
      throw new Error('Input blocked by security policy');
    }
    
    let sanitized = wafResult.isSanitized ? wafResult.sanitizedInput! : input;
    
    // Additional sanitization
    sanitized = sanitized
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .trim()
      .substring(0, 1000); // Limit length

    return sanitized;
  }

  // HTML encoding for display
  static encodeHTML(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Enhanced email validation with WAF - More permissive
  static validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    
    // Trim whitespace first
    const trimmedEmail = email.trim();
    
    // Check with WAF first - but don't block on email validation
    try {
      const wafResult = WAF.scanInput(trimmedEmail, 'email_validation');
      // Only block if it's a critical security issue, not just pattern matching
      if (wafResult.isBlocked && wafResult.triggeredRules.some(rule => rule.includes('xss') || rule.includes('sqli'))) {
        return false;
      }
    } catch (error) {
      // If WAF fails, continue with validation
    }
    
    // More permissive email validation
    if (trimmedEmail.length < 3 || trimmedEmail.length > 254) return false;
    
    // Simplified but robust email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) return false;
    
    // Basic structure checks
    const parts = trimmedEmail.split('@');
    if (parts.length !== 2) return false;
    
    const [localPart, domainPart] = parts;
    
    // Local part checks (more permissive)
    if (localPart.length === 0 || localPart.length > 64) return false;
    
    // Domain part checks (more permissive)
    if (domainPart.length === 0 || domainPart.length > 253) return false;
    if (!domainPart.includes('.')) return false;
    
    // Check for obvious invalid patterns
    if (trimmedEmail.includes('..') || trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) return false;
    if (trimmedEmail.startsWith('@') || trimmedEmail.endsWith('@')) return false;
    
    return true;
  }

  // Enhanced password validation with WAF
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!password || typeof password !== 'string') {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
    
    // Check with WAF first
    try {
      const wafResult = WAF.scanInput(password, 'password_validation');
      if (wafResult.isBlocked) {
        errors.push('Password contains invalid characters');
        return { isValid: false, errors };
      }
    } catch (error) {
      // If WAF fails, continue with validation
    }
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }

    // Check for common weak passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common. Please choose a more secure password');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static checkRateLimit(identifier: string): boolean {
    if (!identifier || typeof identifier !== 'string') return false;
    
    const now = Date.now();
    const attempts = this.loginAttempts.get(identifier);

    if (!attempts) {
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if lockout period has passed
    if (now - attempts.lastAttempt > this.LOCKOUT_DURATION) {
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if max attempts exceeded
    if (attempts.count >= this.MAX_LOGIN_ATTEMPTS) {
      return false;
    }

    // Increment attempt count
    attempts.count++;
    attempts.lastAttempt = now;
    return true;
  }

  static resetRateLimit(identifier: string): void {
    if (identifier && typeof identifier === 'string') {
      this.loginAttempts.delete(identifier);
    }
  }

  static generateCSRFToken(): string {
    try {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      // Fallback for environments without crypto.getRandomValues
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
  }

  static validateCSRFToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken || typeof token !== 'string' || typeof storedToken !== 'string') {
      return false;
    }
    return token === storedToken && token.length >= 32;
  }

  static sanitizeErrorMessage(error: any): string {
    // Generic error messages to prevent information leakage
    const genericMessages: { [key: string]: string } = {
      'auth/user-not-found': 'Invalid email or password',
      'auth/wrong-password': 'Invalid email or password',
      'auth/invalid-credential': 'Invalid email or password',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/weak-password': 'Password does not meet security requirements',
      'auth/invalid-email': 'Please enter a valid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/operation-not-allowed': 'This operation is not allowed',
      'auth/requires-recent-login': 'Please log in again to continue',
      'user_already_exists': 'An account with this email already exists'
    };

    if (error?.code && genericMessages[error.code]) {
      return genericMessages[error.code];
    }

    // Don't expose internal error details
    return 'An unexpected error occurred. Please try again.';
  }

  static logSecurityEvent(event: string, details: any): void {
    // Sanitize details to prevent logging sensitive information
    const sanitizedDetails = {
      ...details,
      password: undefined,
      token: undefined,
      key: undefined,
      secret: undefined
    };

    // In production, this would send to a security monitoring service
    if (import.meta.env.VITE_ENABLE_SECURITY_LOGGING === 'true') {
      console.warn(`Security Event: ${event}`, {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent.substring(0, 200), // Limit length
        url: window.location.href,
        details: sanitizedDetails
      });
    }
  }

  // Content Security Policy helpers
  static isValidURL(url: string): boolean {
    try {
      const parsedURL = new URL(url);
      // Only allow http and https protocols
      return ['http:', 'https:'].includes(parsedURL.protocol);
    } catch {
      return false;
    }
  }

  // Validate file uploads (if implemented)
  static validateFileUpload(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 5MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only image files are allowed' };
    }

    return { isValid: true };
  }

  // WAF integration methods
  static validateFormData(formData: Record<string, any>, context: string = 'form'): {
    isValid: boolean;
    sanitizedData?: Record<string, any>;
    errors: string[];
  } {
    const result = WAF.scanObject(formData, context);
    
    if (result.isBlocked) {
      return {
        isValid: false,
        errors: ['Form contains potentially malicious content']
      };
    }

    return {
      isValid: true,
      sanitizedData: result.sanitizedObject,
      errors: []
    };
  }

  static getWAFStats() {
    return WAF.getStats();
  }

  static getWAFEvents(limit: number = 100) {
    return WAF.getEvents(limit);
  }
}