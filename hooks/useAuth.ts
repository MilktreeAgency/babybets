/**
 * Authentication Hook
 * 
 * Manages user authentication state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signIn, signUp, signOut, resetPassword, updatePassword } from '../lib/supabase';
import type { Tables } from '../types/database';

type Profile = Tables<'profiles'>;

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isInfluencer: boolean;
}

interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: { firstName?: string; lastName?: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAdmin: false,
    isInfluencer: false,
  });

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }, []);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    
    const profile = await fetchProfile(state.user.id);
    if (profile) {
      setState(prev => ({
        ...prev,
        profile,
        isAdmin: profile.role === 'admin' || profile.role === 'super_admin',
        isInfluencer: profile.role === 'influencer',
      }));
    }
  }, [state.user, fetchProfile]);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          session,
          isLoading: false,
          isAdmin: profile?.role === 'admin' || profile?.role === 'super_admin',
          isInfluencer: profile?.role === 'influencer',
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: session.user,
            profile,
            session,
            isLoading: false,
            isAdmin: profile?.role === 'admin' || profile?.role === 'super_admin',
            isInfluencer: profile?.role === 'influencer',
          });
        } else {
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAdmin: false,
            isInfluencer: false,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign in handler
  const handleSignIn = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    return { error: error as Error | null };
  };

  // Sign up handler
  const handleSignUp = async (
    email: string,
    password: string,
    metadata?: { firstName?: string; lastName?: string }
  ) => {
    const { data, error } = await signUp(email, password, metadata);
    
    // Create profile if signup successful
    if (data.user && !error) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        first_name: metadata?.firstName || null,
        last_name: metadata?.lastName || null,
      });
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }
    
    return { error: error as Error | null };
  };

  // Sign out handler
  const handleSignOut = async () => {
    await signOut();
    setState({
      user: null,
      profile: null,
      session: null,
      isLoading: false,
      isAdmin: false,
      isInfluencer: false,
    });
  };

  // Reset password handler
  const handleResetPassword = async (email: string) => {
    const { error } = await resetPassword(email);
    return { error: error as Error | null };
  };

  // Update password handler
  const handleUpdatePassword = async (newPassword: string) => {
    const { error } = await updatePassword(newPassword);
    return { error: error as Error | null };
  };

  // Update profile handler
  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) {
      return { error: new Error('Not authenticated') };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', state.user.id);

    if (!error) {
      await refreshProfile();
    }

    return { error: error as Error | null };
  };

  return {
    ...state,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    updateProfile: handleUpdateProfile,
    refreshProfile,
  };
}

export default useAuth;
