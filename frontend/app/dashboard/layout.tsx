"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar, SidebarToggle, type Conversation } from "@/components/layout/sidebar";
import { useAuth } from "@/context/AuthContext";

const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Project architecture discussion",
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "React hooks best practices",
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Database optimization tips",
    updatedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "API design patterns",
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    title: "TypeScript generics guide",
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    title: "CSS Grid vs Flexbox",
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
];

interface DashboardContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  createNewConversation: () => void;
  deleteConversation: (id: string) => void;
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
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  const createNewConversation = () => {
    setCurrentConversationId(null);
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
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
