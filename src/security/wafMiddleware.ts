// WAF Middleware for React Components
import { WAF } from './waf';

export interface WAFMiddlewareOptions {
  context?: string;
  blockOnDetection?: boolean;
  sanitizeInput?: boolean;
  logEvents?: boolean;
}

export class WAFMiddleware {
  public static validateFormData(
    formData: Record<string, any>,
    options: WAFMiddlewareOptions = {}
  ): {
    isValid: boolean;
    sanitizedData?: Record<string, any>;
    errors: string[];
    blockedFields: string[];
  } {
    const {
      context = 'form',
      blockOnDetection = true,
      sanitizeInput = true,
      logEvents = true
    } = options;

    const errors: string[] = [];
    const blockedFields: string[] = [];
    let sanitizedData: Record<string, any> = {};
    let isValid = true;

    for (const [field, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        const result = WAF.scanInput(value, `${context}.${field}`);
        
        if (result.isBlocked && blockOnDetection) {
          isValid = false;
          blockedFields.push(field);
          errors.push(`Invalid content detected in ${field}`);
        } else if (result.isSanitized && sanitizeInput) {
          sanitizedData[field] = result.sanitizedInput;
        } else {
          sanitizedData[field] = value;
        }
      } else {
        sanitizedData[field] = value;
      }
    }

    return {
      isValid,
      sanitizedData: isValid ? sanitizedData : undefined,
      errors,
      blockedFields
    };
  }

  public static validateApiRequest(
    data: any,
    endpoint: string
  ): {
    isAllowed: boolean;
    sanitizedData?: any;
    reason?: string;
  } {
    const result = WAF.scanObject(data, `api.${endpoint}`);
    
    if (result.isBlocked) {
      return {
        isAllowed: false,
        reason: 'Request blocked by security policy'
      };
    }

    return {
      isAllowed: true,
      sanitizedData: result.sanitizedObject || data
    };
  }

  public static createInputValidator(context: string) {
    return (value: string): {
      isValid: boolean;
      sanitizedValue?: string;
      error?: string;
    } => {
      const result = WAF.scanInput(value, context);
      
      if (result.isBlocked) {
        return {
          isValid: false,
          error: 'Input contains potentially malicious content'
        };
      }

      return {
        isValid: true,
        sanitizedValue: result.isSanitized ? result.sanitizedInput : value
      };
    };
  }
}

// React Hook for WAF validation
import { useState, useCallback } from 'react';

export function useWAFValidation(context: string = 'component') {
  const [errors, setErrors] = useState<string[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);

  const validateInput = useCallback((input: string): {
    isValid: boolean;
    sanitizedInput?: string;
  } => {
    const result = WAF.scanInput(input, context);
    
    if (result.isBlocked) {
      setIsBlocked(true);
      setErrors(['Input contains potentially malicious content']);
      return { isValid: false };
    }

    setIsBlocked(false);
    setErrors([]);
    
    return {
      isValid: true,
      sanitizedInput: result.isSanitized ? result.sanitizedInput : input
    };
  }, [context]);

  const validateForm = useCallback((formData: Record<string, any>): {
    isValid: boolean;
    sanitizedData?: Record<string, any>;
  } => {
    const result = WAFMiddleware.validateFormData(formData, { context });
    
    setIsBlocked(!result.isValid);
    setErrors(result.errors);
    
    return {
      isValid: result.isValid,
      sanitizedData: result.sanitizedData
    };
  }, [context]);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setIsBlocked(false);
  }, []);

  return {
    validateInput,
    validateForm,
    clearErrors,
    errors,
    isBlocked
  };
}