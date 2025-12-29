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

export async function streamMessage(
  conversationId: number,
  content: string,
  onUserMessage: (msg: Message) => void,
  onChunk: (chunk: string) => void,
  onDone: (data: { id: number; created_at: string }) => void
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  const response = await fetch(
    `${baseUrl}/conversations/${conversationId}/messages/stream`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content }),
    }
  )

  if (!response.ok) throw new Error("Stream failed")
  if (!response.body) throw new Error("No response body")

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n\n")
    buffer = lines.pop() || ""

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const jsonData = JSON.parse(line.slice(6))
        if (jsonData.type === "user_message") {
          onUserMessage(jsonData.data)
        } else if (jsonData.type === "chunk") {
          onChunk(jsonData.data)
        } else if (jsonData.type === "done") {
          onDone(jsonData.data)
        }
      }
    }
  }
}
