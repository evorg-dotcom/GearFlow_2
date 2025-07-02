import { createClient } from '@supabase/supabase-js';

// Validate required environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch {
  throw new Error('Invalid VITE_SUPABASE_URL format');
}

// Validate anon key format (basic JWT structure check)
if (!supabaseAnonKey.includes('.') || supabaseAnonKey.length < 100) {
  throw new Error('Invalid VITE_SUPABASE_ANON_KEY format');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // Use PKCE flow for better security
  },
  global: {
    headers: {
      'X-Client-Info': 'autosense-pro-web'
    }
  }
});

// Security event logging for auth events
supabase.auth.onAuthStateChange((event, session) => {
  if (import.meta.env.VITE_ENABLE_SECURITY_LOGGING === 'true') {
    console.log('Auth event:', event, {
      userId: session?.user?.id,
      timestamp: new Date().toISOString()
    });
  }
});