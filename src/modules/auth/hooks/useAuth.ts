import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { setUser, setProfile, setRole, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUser(session.user);
          // Fetch profile and role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, roles(name)')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setProfile(profile);
            setRole(profile.roles?.name || 'viewer');
          }
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
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
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, roles(name)')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setProfile(profile);
            setRole(profile.roles?.name || 'viewer');
          }
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
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
