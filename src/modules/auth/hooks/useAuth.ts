import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { setUser, setProfile, setRole, setApproved, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUser(session.user);
          
          // Super Admin Bypass
          if (session.user.email === 'rizal.h33@gmail.com') {
            setRole('super_admin');
            setApproved(true);
            setProfile({ email: session.user.email, full_name: 'Super Admin' });
            return;
          }

          // Fetch profile and role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, roles(name)')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setProfile(profile);
            setRole(profile.roles?.name || 'viewer');
            setApproved(profile.is_active);
          } else {
            setApproved(false);
          }
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
          setApproved(false);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
          setUser(session.user);
          
          if (session.user.email === 'rizal.h33@gmail.com') {
            setRole('super_admin');
            setApproved(true);
            setProfile({ email: session.user.email, full_name: 'Super Admin' });
            return;
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('*, roles(name)')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setProfile(profile);
            setRole(profile.roles?.name || 'viewer');
            setApproved(profile.is_active);
          } else {
            setApproved(false);
          }
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
          setApproved(false);
        }
      });
      subscription = data.subscription;
    } catch (error) {
      console.error('Auth state change listener failed:', error);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser, setProfile, setRole, setLoading]);

  return { supabase };
};
