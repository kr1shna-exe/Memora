import api from "./client"

interface Conversation {
  id: number
  title: string
  updated_at: string
}

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  created_at: string
}

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await api.get("/conversations")
  return data.conversations
}

export async function createConversation(title: string): Promise<Conversation> {
  const { data } = await api.post("/conversations", { title })
  return data
}

export async function getConversation(conversationId: number): Promise<{
  id: number
  title: string
  messages: Message[]
}> {
  const { data } = await api.get(`/conversations/${conversationId}`)
  return data
}

export async function sendMessage(conversationId: number, content: string): Promise<{
  user_message: Message
  assistant_message: Message
}> {
  const { data } = await api.post(`/conversations/${conversationId}/messages`, { content })
  return data
}

export async function deleteConversation(conversationId: number): Promise<void> {
  await api.delete(`/conversations/${conversationId}`)
}
