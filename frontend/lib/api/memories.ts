import api from "./client"

enum MemoryType {
  EPISODIC = "episodic",
  SEMANTIC = "semantic"
}

interface MemoryResponse {
  id: string
  content: string
  memory_type: MemoryType
  metadata: Record<string, unknown>
  user_id: string
  timestamp: string
}

export interface Memory {
  id: string
  content: string
  type: MemoryType
  timestamp: Date
}

export async function getMemories(): Promise<Memory[]> {
  const { data } = await api.get("/memory/all");
  return data.memories.map((mem: MemoryResponse) => ({
    id: mem.id,
    content: mem.content,
    type: mem.memory_type,
    timestamp: new Date(mem.timestamp)
  }))
}

export async function deleteMemories(memory_id: string): Promise<void> {
  await api.delete(`/memory/${memory_id}`)
}
