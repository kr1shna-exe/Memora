"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getMe,
  User,
  RegisterPayload,
  LoginPayload
} from "@/lib/api/auth";

interface AuthContext {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then(setUser).catch(() => setUser(null)).finally(() => setIsLoading(false));
  }, [])

  const login = async (payload: LoginPayload) => {
    const user = await apiLogin(payload)
    setUser(user)
  }

  const register = async (payload: RegisterPayload) => {
    const user = await apiRegister(payload)
    setUser(user)
  }

  const logout = async () => {
    await apiLogout()
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }} >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
