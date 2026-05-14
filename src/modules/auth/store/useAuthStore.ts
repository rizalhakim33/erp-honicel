import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null;
  role: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setRole: (role: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      role: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setRole: (role) => set({ role }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, profile: null, role: null, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ role: state.role }), // Persist minimal info
    }
  )
);
