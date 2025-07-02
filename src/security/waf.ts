// Web Application Firewall (WAF) Implementation
export interface WAFRule {
  id: string;
  name: string;
  pattern: RegExp;
  action: 'block' | 'log' | 'sanitize';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  contexts?: string[]; // Optional: only apply to specific contexts
}

export interface WAFEvent {
  timestamp: number;
  ruleId: string;
  ruleName: string;
  severity: string;
  action: string;
  input: string;
  sanitized?: string;
  userAgent: string;
  ip?: string;
  url: string;
  context?: string;
}

export class WebApplicationFirewall {
  private static instance: WebApplicationFirewall;
  private rules: WAFRule[] = [];
  private events: WAFEvent[] = [];
  private maxEvents = 1000;
  private isEnabled = true;

  private constructor() {
    this.initializeDefaultRules();
  }

  public static getInstance(): WebApplicationFirewall {
    if (!WebApplicationFirewall.instance) {
      WebApplicationFirewall.instance = new WebApplicationFirewall();
    }
    return WebApplicationFirewall.instance;
  }

  private initializeDefaultRules(): void {
    this.rules = [
      // XSS Protection Rules - Only for user content, not authentication
      {
        id: 'xss-001',
        name: 'Script Tag Detection',
        pattern: /<script[^>]*>.*?<\/script>/gi,
        action: 'block',
        severity: 'critical',
        description: 'Detects script tags that could be used for XSS attacks',
        contexts: ['user_content', 'post_content', 'comment']
      },
      {
        id: 'xss-002',
        name: 'JavaScript Event Handler',
        pattern: /on\w+\s*=\s*["\']?[^"\']*["\']?/gi,
        action: 'block',
        severity: 'high',
        description: 'Detects JavaScript event handlers in HTML attributes',
        contexts: ['user_content', 'post_content', 'comment']
      },
      {
        id: 'xss-003',
        name: 'JavaScript Protocol',
        pattern: /javascript\s*:/gi,
        action: 'block',
        severity: 'high',
        description: 'Detects javascript: protocol usage',
        contexts: ['user_content', 'post_content', 'comment', 'url_input']
      },
      {
        id: 'xss-004',
        name: 'Data URI with Script',
        pattern: /data\s*:\s*text\/html/gi,
        action: 'block',
        severity: 'high',
        description: 'Detects data URIs that could execute scripts',
        contexts: ['user_content', 'post_content', 'comment']
      },
      {
        id: 'xss-005',
        name: 'VBScript Detection',
        pattern: /vbscript\s*:/gi,
        action: 'block',
        severity: 'high',
        description: 'Detects VBScript protocol usage',
        contexts: ['user_content', 'post_content', 'comment']
      },

      // SQL Injection Protection Rules - Only for search and user content
      {
        id: 'sqli-001',
        name: 'SQL Union Attack',
        pattern: /\bunion\b.*\bselect\b/gi,
        action: 'block',
        severity: 'critical',
        description: 'Detects SQL UNION-based injection attempts',
        contexts: ['search', 'user_content', 'post_content']
      },
      {
        id: 'sqli-002',
        name: 'SQL Comment Injection',
        pattern: /(--|\/\*|\*\/|#)/g,
        action: 'log',
        severity: 'medium',
        description: 'Detects SQL comment patterns',
        contexts: ['search', 'user_content']
      },
      {
        id: 'sqli-003',
        name: 'SQL Drop Table',
        pattern: /\bdrop\s+table\b/gi,
        action: 'block',
        severity: 'critical',
        description: 'Detects DROP TABLE statements',
        contexts: ['search', 'user_content', 'post_content']
      },
      {
        id: 'sqli-004',
        name: 'SQL Delete Statement',
        pattern: /\bdelete\s+from\b/gi,
        action: 'block',
        severity: 'critical',
        description: 'Detects DELETE FROM statements',
        contexts: ['search', 'user_content', 'post_content']
      },

      // Command Injection Protection - Only for user content
      {
        id: 'cmd-001',
        name: 'Command Chaining',
        pattern: /[;&|`$()]/g,
        action: 'sanitize',
        severity: 'medium',
        description: 'Detects command chaining characters',
        contexts: ['user_content', 'post_content', 'search']
      },
      {
        id: 'cmd-002',
        name: 'System Commands',
        pattern: /\b(cat|ls|pwd|whoami|id|uname|ps|netstat|ifconfig|ping|wget|curl|nc|telnet|ssh|ftp)\b/gi,
        action: 'log',
        severity: 'medium',
        description: 'Detects common system commands',
        contexts: ['user_content', 'post_content', 'search']
      },

      // Path Traversal Protection
      {
        id: 'path-001',
        name: 'Directory Traversal',
        pattern: /\.\.[\/\\]/g,
        action: 'block',
        severity: 'high',
        description: 'Detects directory traversal attempts',
        contexts: ['file_upload', 'user_content']
      },
      {
        id: 'path-002',
        name: 'Absolute Path Access',
        pattern: /^[\/\\]|^[a-zA-Z]:[\/\\]/g,
        action: 'block',
        severity: 'medium',
        description: 'Detects absolute path access attempts',
        contexts: ['file_upload', 'user_content']
      },

      // LDAP Injection Protection - Only for search
      {
        id: 'ldap-001',
        name: 'LDAP Injection',
        pattern: /[()&|!]/g,
        action: 'sanitize',
        severity: 'medium',
        description: 'Detects LDAP injection characters',
        contexts: ['search', 'user_content']
      },

      // XML/XXE Protection
      {
        id: 'xml-001',
        name: 'XML External Entity',
        pattern: /<!ENTITY/gi,
        action: 'block',
        severity: 'high',
        description: 'Detects XML external entity declarations',
        contexts: ['user_content', 'file_upload']
      },
      {
        id: 'xml-002',
        name: 'XML DOCTYPE',
        pattern: /<!DOCTYPE/gi,
        action: 'log',
        severity: 'medium',
        description: 'Detects XML DOCTYPE declarations',
        contexts: ['user_content', 'file_upload']
      },

      // NoSQL Injection Protection
      {
        id: 'nosql-001',
        name: 'MongoDB Injection',
        pattern: /\$where|\$ne|\$gt|\$lt|\$regex/gi,
        action: 'block',
        severity: 'high',
        description: 'Detects MongoDB injection operators',
        contexts: ['search', 'user_content']
      },

      // File Upload Protection
      {
        id: 'file-001',
        name: 'Executable File Extension',
        pattern: /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|php|asp|aspx|jsp)$/gi,
        action: 'block',
        severity: 'critical',
        description: 'Detects potentially dangerous file extensions',
        contexts: ['file_upload']
      },

      // Rate Limiting Patterns - Only for user content
      {
        id: 'rate-001',
        name: 'Excessive Special Characters',
        pattern: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{20,}/g,
        action: 'block',
        severity: 'medium',
        description: 'Detects excessive special characters (potential attack)',
        contexts: ['user_content', 'post_content', 'search']
      },

      // Content Length Protection
      {
        id: 'size-001',
        name: 'Oversized Input',
        pattern: /.{10000,}/g,
        action: 'block',
        severity: 'medium',
        description: 'Detects oversized input that could cause DoS',
        contexts: ['user_content', 'post_content', 'search']
      }
    ];
  }

  public scanInput(input: string, context: string = 'general'): {
    isBlocked: boolean;
    isSanitized: boolean;
    sanitizedInput?: string;
    triggeredRules: string[];
    events: WAFEvent[];
  } {
    if (!this.isEnabled || !input || typeof input !== 'string') {
      return {
        isBlocked: false,
        isSanitized: false,
        triggeredRules: [],
        events: []
      };
    }

    // Skip WAF for authentication contexts to avoid blocking legitimate credentials
    const authContexts = ['email_validation', 'password_validation', 'login_form', 'signup_form'];
    if (authContexts.includes(context)) {
      return {
        isBlocked: false,
        isSanitized: false,
        triggeredRules: [],
        events: []
      };
    }

    const triggeredRules: string[] = [];
    const events: WAFEvent[] = [];
    let isBlocked = false;
    let sanitizedInput = input;
    let isSanitized = false;

    for (const rule of this.rules) {
      // Skip rule if it doesn't apply to this context
      if (rule.contexts && !rule.contexts.includes(context)) {
        continue;
      }

      if (rule.pattern.test(input)) {
        triggeredRules.push(rule.id);

        const event: WAFEvent = {
          timestamp: Date.now(),
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity,
          action: rule.action,
          input: input.substring(0, 200), // Limit logged input length
          userAgent: navigator.userAgent.substring(0, 200),
          url: window.location.href,
          context
        };

        switch (rule.action) {
          case 'block':
            isBlocked = true;
            this.logEvent(event);
            break;

          case 'sanitize':
            sanitizedInput = sanitizedInput.replace(rule.pattern, '');
            isSanitized = true;
            event.sanitized = sanitizedInput.substring(0, 200);
            this.logEvent(event);
            break;

          case 'log':
            this.logEvent(event);
            break;
        }

        events.push(event);
      }
    }

    return {
      isBlocked,
      isSanitized,
      sanitizedInput: isSanitized ? sanitizedInput : undefined,
      triggeredRules,
      events
    };
  }

  public scanObject(obj: any, context: string = 'general'): {
    isBlocked: boolean;
    sanitizedObject?: any;
    triggeredRules: string[];
    events: WAFEvent[];
  } {
    // Skip WAF for authentication contexts
    const authContexts = ['email_validation', 'password_validation', 'login_form', 'signup_form'];
    if (authContexts.includes(context)) {
      return {
        isBlocked: false,
        sanitizedObject: obj,
        triggeredRules: [],
        events: []
      };
    }

    const allTriggeredRules: string[] = [];
    const allEvents: WAFEvent[] = [];
    let isBlocked = false;
    let sanitizedObject = { ...obj };

    const scanValue = (value: any, key: string): any => {
      if (typeof value === 'string') {
        const result = this.scanInput(value, `${context}.${key}`);
        
        if (result.isBlocked) {
          isBlocked = true;
        }
        
        allTriggeredRules.push(...result.triggeredRules);
        allEvents.push(...result.events);
        
        return result.isSanitized ? result.sanitizedInput : value;
      } else if (typeof value === 'object' && value !== null) {
        const scannedObj: any = {};
        for (const [subKey, subValue] of Object.entries(value)) {
          scannedObj[subKey] = scanValue(subValue, `${key}.${subKey}`);
        }
        return scannedObj;
      }
      return value;
    };

    for (const [key, value] of Object.entries(obj)) {
      sanitizedObject[key] = scanValue(value, key);
    }

    return {
      isBlocked,
      sanitizedObject: isBlocked ? undefined : sanitizedObject,
      triggeredRules: [...new Set(allTriggeredRules)],
      events: allEvents
    };
  }

  private logEvent(event: WAFEvent): void {
    this.events.push(event);
    
    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn(`WAF Alert [${event.severity.toUpperCase()}]: ${event.ruleName}`, {
        ruleId: event.ruleId,
        input: event.input,
        action: event.action,
        context: event.context,
        timestamp: new Date(event.timestamp).toISOString()
      });
    }

    // In production, send to monitoring service
    if (import.meta.env.PROD && event.severity === 'critical') {
      this.sendToMonitoring(event);
    }
  }

  private sendToMonitoring(event: WAFEvent): void {
    // In a real application, send to your monitoring service
    // Example: Sentry, DataDog, CloudWatch, etc.
    try {
      fetch('/api/security/waf-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      }).catch(() => {
        // Fail silently to not break user experience
      });
    } catch {
      // Fail silently
    }
  }

  public getEvents(limit: number = 100): WAFEvent[] {
    return this.events.slice(-limit);
  }

  public getEventsByRule(ruleId: string): WAFEvent[] {
    return this.events.filter(event => event.ruleId === ruleId);
  }

  public getEventsBySeverity(severity: string): WAFEvent[] {
    return this.events.filter(event => event.severity === severity);
  }

  public clearEvents(): void {
    this.events = [];
  }

  public addCustomRule(rule: WAFRule): void {
    this.rules.push(rule);
  }

  public removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
  }

  public enableRule(ruleId: string): void {
    // Implementation for enabling/disabling specific rules
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      // Add enabled flag to rule interface if needed
    }
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public getStats(): {
    totalEvents: number;
    blockedRequests: number;
    sanitizedRequests: number;
    criticalEvents: number;
    topRules: Array<{ ruleId: string; count: number }>;
  } {
    const totalEvents = this.events.length;
    const blockedRequests = this.events.filter(e => e.action === 'block').length;
    const sanitizedRequests = this.events.filter(e => e.action === 'sanitize').length;
    const criticalEvents = this.events.filter(e => e.severity === 'critical').length;

    // Count rule triggers
    const ruleCounts = new Map<string, number>();
    this.events.forEach(event => {
      const count = ruleCounts.get(event.ruleId) || 0;
      ruleCounts.set(event.ruleId, count + 1);
    });

    const topRules = Array.from(ruleCounts.entries())
      .map(([ruleId, count]) => ({ ruleId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents,
      blockedRequests,
      sanitizedRequests,
      criticalEvents,
      topRules
    };
  }
}

// Singleton instance
export const WAF = WebApplicationFirewall.getInstance();