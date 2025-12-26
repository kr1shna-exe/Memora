import api from "./client";

export interface Response {
  username: string
  email: string
}

export interface Payload {
  username: string
  email: string
  password: string
}

export async function register(payload: Payload): Promise<Response> {
  const response = await api.post("/auth/register", payload);
  return response.data.user;
}

export async function login(payload: Payload): Promise<Response> {
  const { data } = await api.post("/auth/login", payload);
  return data.user;
}

export async function getMe(): Promise<Response> {
  const { data } = await api.get("/auth/me");
  return data.user;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
