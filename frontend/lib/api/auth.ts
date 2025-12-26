import api from "./client";

export interface User {
  username: string
  email: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export async function register(payload: RegisterPayload): Promise<User> {
  const response = await api.post("/auth/register", payload);
  return response.data.user;
}

export async function login(payload: LoginPayload): Promise<User> {
  const { data } = await api.post("/auth/login", payload);
  return data.user;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return data.user;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
