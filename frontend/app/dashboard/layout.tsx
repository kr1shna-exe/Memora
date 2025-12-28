"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar, SidebarToggle, type Conversation } from "@/components/layout/sidebar";
import { useAuth } from "@/context/AuthContext";
import { getConversations, deleteConversation as apiDeleteConversation } from "@/lib/api/conversations";


interface DashboardContextType {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  currentConversationId: number | null;
  setCurrentConversationId: (id: number | null) => void;
  createNewConversation: () => void;
  deleteConversation: (id: number) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardLayout");
  }
  return context;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const data = await getConversations()
        setConversations(data)
      } catch (error) {
        console.log("Failed to fetch conversations:", error)
      }
    }
    if (user) {
      fetchConversations()
    }
  }, [user])

  const createNewConversation = () => {
    setCurrentConversationId(null);
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  };

  const handleSelectConversation = (id: number) => {
    setCurrentConversationId(id);
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  };

  const deleteConversation = async (id: number) => {
    try {
      await apiDeleteConversation(id)
      setConversations(prev => prev.filter(c => c.id !== id))
      if (currentConversationId === id) {
        setCurrentConversationId(null);
      }
    } catch (error) {
      console.log("Failed to delete conversation:", error)
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f0f10]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const contextValue: DashboardContextType = {
    conversations,
    setConversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    deleteConversation,
    sidebarCollapsed,
    setSidebarCollapsed,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="flex h-screen bg-[#0f0f10]">
        <Sidebar
          user={user}
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewChat={createNewConversation}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={deleteConversation}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 flex flex-col min-w-0 relative">
          {sidebarCollapsed && (
            <div className="absolute top-5 left-4 z-50">
              <SidebarToggle onClick={() => setSidebarCollapsed(false)} />
            </div>
          )}
          {children}
        </main>
      </div>
    </DashboardContext.Provider>
  );
}
