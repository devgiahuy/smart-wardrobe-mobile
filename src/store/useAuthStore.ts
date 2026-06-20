import { create } from 'zustand';
import { clearTokens } from '../lib/storage';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: (user) => set({ isAuthenticated: true, user, isLoading: false }),
  logout: () => {
    clearTokens();
    set({ isAuthenticated: false, user: null, isLoading: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));
