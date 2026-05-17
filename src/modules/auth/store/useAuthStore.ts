import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null;
  role: string | null;
  isApproved: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setRole: (role: string | null) => void;
  setApproved: (isApproved: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      role: null,
      isApproved: false,
      isLoading: true,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setRole: (role) => set({ role }),
      setApproved: (isApproved) => set({ isApproved }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, profile: null, role: null, isApproved: false, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ role: state.role, isApproved: state.isApproved }), 
    }
  )
);
