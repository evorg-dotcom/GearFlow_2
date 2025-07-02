import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { SecurityUtils } from '../utils/security';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      SecurityUtils.logSecurityEvent('user_signup', { 
        userId: data.user?.id,
        email: data.user?.email 
      });
    } catch (error: any) {
      SecurityUtils.logSecurityEvent('signup_error', { 
        email,
        error: error?.message 
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      SecurityUtils.logSecurityEvent('user_login', { 
        userId: data.user?.id,
        email: data.user?.email 
      });
    } catch (error: any) {
      SecurityUtils.logSecurityEvent('login_error', { 
        email,
        error: error?.message 
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (currentUser) {
        SecurityUtils.logSecurityEvent('user_logout', { 
          userId: currentUser.id,
          email: currentUser.email 
        });
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      SecurityUtils.logSecurityEvent('logout_error', { 
        error: error?.message 
      });
      throw error;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setCurrentUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          SecurityUtils.logSecurityEvent('auth_state_changed', { 
            userId: session.user.id,
            email: session.user.email,
            action: 'user_authenticated'
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Auto-logout after 24 hours of inactivity
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      if (currentUser) {
        timeoutId = setTimeout(() => {
          SecurityUtils.logSecurityEvent('auto_logout', { 
            userId: currentUser.id,
            reason: 'session_timeout'
          });
          logout();
        }, 24 * 60 * 60 * 1000); // 24 hours
      }
    };

    const handleActivity = () => {
      resetTimeout();
    };

    if (currentUser) {
      resetTimeout();
      
      // Reset timeout on user activity
      window.addEventListener('mousedown', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('scroll', handleActivity);
      window.addEventListener('touchstart', handleActivity);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [currentUser]);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};