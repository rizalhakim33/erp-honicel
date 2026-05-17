import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { setUser, setProfile, setRole, setApproved, setLoading } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    // Safety timeout to ensure loading screen doesn't stick
    const safetyTimeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 8000);

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session) {
          setUser(session.user);
          
          const email = session.user.email?.toLowerCase();
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*, roles(name)')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setProfile(profile);
            setRole(profile.roles?.name || 'viewer');
            setApproved(profile.is_active || false);
          } else if (email === 'rizal.h33@gmail.com') {
            // Super Admin Fallback if no profile record yet
            setRole('super_admin');
            setApproved(true);
            setProfile({ email: session.user.email, full_name: 'Super Admin' });
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
        if (mounted) {
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session) {
        setUser(session.user);
        const email = session.user.email?.toLowerCase();
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*, roles(name)')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setProfile(profile);
          setRole(profile.roles?.name || 'viewer');
          setApproved(profile.is_active || false);
        } else if (email === 'rizal.h33@gmail.com') {
          setRole('super_admin');
          setApproved(true);
          setProfile({ email: session.user.email, full_name: 'Super Admin' });
        } else {
          setApproved(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
        setApproved(false);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { supabase };
};
