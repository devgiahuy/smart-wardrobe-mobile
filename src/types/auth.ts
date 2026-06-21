export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  isPremium?: boolean;
  joinDate?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  login: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}
