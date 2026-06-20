import { create } from 'zustand';
import { UserRes } from '@/features/auth/types';

interface AuthState {
  user: UserRes | null;
  isAuthenticated: boolean;
  login: (user: UserRes) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set: any) => ({
  user: null,
  isAuthenticated: false,
  login: (user: UserRes) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
