"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import * as authService from "@/services/auth";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  ProfileResponse,
} from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  getCurrentUser: () => User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function profileToUser(profile: ProfileResponse): User {
  return {
    id: profile.userId,
    name: "",
    email: profile.email,
    createdAt: "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profileToUser(profile));
    } catch {
      authService.logout();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    async function init() {
      const token = getStoredToken();
      if (token) {
        await fetchProfile();
      }
      setLoading(false);
    }

    init();
  }, [fetchProfile]);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    localStorage.setItem("token", response.access_token);
    await fetchProfile();
  };

  const register = async (data: RegisterRequest) => {
    await authService.register(data);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const getToken = (): string | null => {
    return getStoredToken();
  };

  const getCurrentUser = (): User | null => {
    return user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout: handleLogout,
        getToken,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
