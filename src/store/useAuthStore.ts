import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, AuthActions, User } from '../types/auth';
import { zustandStorage, secureStorage, TOKEN_KEYS } from '../lib/storage';

export const MOCK_USER: User = {
  id: "u1",
  name: "Ngô Gia",
  username: "ngogia_style",
  email: "ngogia@example.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
  isPremium: false,
};

export const useAuthStore = create<AuthState & AuthActions & { mockLogin: () => void }>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      login: async (user, accessToken, refreshToken) => {
        await secureStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
        await secureStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
        set({ user, isAuthenticated: true });
      },

      mockLogin: () => {
        set({ user: MOCK_USER, isAuthenticated: true });
      },
      
      logout: async () => {
        await secureStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        await secureStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
