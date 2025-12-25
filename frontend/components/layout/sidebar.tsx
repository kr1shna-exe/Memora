"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  MessageSquare,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Trash2,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: Date;
}

interface ConversationGroup {
  label: string;
  conversations: Conversation[];
}

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  conversations?: Conversation[];
  currentConversationId?: string | null;
  onNewChat?: () => void;
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function groupConversationsByDate(conversations: Conversation[]): ConversationGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const groups: ConversationGroup[] = [
    { label: "Today", conversations: [] },
    { label: "Yesterday", conversations: [] },
    { label: "Previous 7 days", conversations: [] },
    { label: "Previous 30 days", conversations: [] },
    { label: "Older", conversations: [] },
  ];

  conversations.forEach((conv) => {
    const convDate = new Date(conv.updatedAt);
    if (convDate >= today) {
      groups[0].conversations.push(conv);
    } else if (convDate >= yesterday) {
      groups[1].conversations.push(conv);
    } else if (convDate >= lastWeek) {
      groups[2].conversations.push(conv);
    } else if (convDate >= lastMonth) {
      groups[3].conversations.push(conv);
    } else {
      groups[4].conversations.push(conv);
    }
  });

  return groups.filter((group) => group.conversations.length > 0);
}

export function Sidebar({
  user,
  conversations = [],
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const groupedConversations = groupConversationsByDate(conversations);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    localStorage.removeItem("memora_token");
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-[#0a0a0b] transition-all duration-300 ease-in-out",
        isCollapsed ? "w-0 overflow-hidden" : "w-[260px]"
      )}
    >
      <div className="flex h-14 items-center justify-between px-3 pt-2">
        <button
          onClick={onToggleCollapse}
          className="flex cursor-pointer h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          title="Close sidebar"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>

        <button
          onClick={onNewChat}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          title="New chat"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="px-3 py-2">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
        >
          <Brain className="h-5 w-5 text-blue-400" />
          <span>Memora</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-2">
        {groupedConversations.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
            <p className="text-xs text-zinc-500">No conversations yet</p>
          </div>
        ) : (
          groupedConversations.map((group) => (
            <div key={group.label} className="mb-4">
              <h3 className="px-3 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {group.label}
              </h3>
              <div className="space-y-0.5">
                {group.conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="relative group"
                    onMouseEnter={() => setHoveredConversation(conv.id)}
                    onMouseLeave={() => setHoveredConversation(null)}
                  >
                    <button
                      onClick={() => onSelectConversation?.(conv.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-left",
                        currentConversationId === conv.id
                          ? "bg-zinc-800 text-zinc-100"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                      )}
                    >
                      <span className="truncate flex-1">{conv.title}</span>
                    </button>

                    <AnimatePresence>
                      {hoveredConversation === conv.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation?.(conv.id);
                            }}
                            className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                            title="Delete conversation"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </nav>

      <div className="border-t border-zinc-800 p-3" ref={menuRef}>
        <div className="relative">
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden"
              >
                <div className="p-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors cursor-pointer",
              showUserMenu
                ? "bg-zinc-800 text-zinc-100"
                : "hover:bg-zinc-800/50"
            )}
          >
            <Avatar
              fallback={user?.name || "User"}
              src={user?.avatar}
              size="sm"
              className="bg-blue-600 text-white"
            />
            <div className="flex-1 min-w-0 text-left">
              <p className="truncate text-sm font-medium text-zinc-200">
                {user?.name || "User"}
              </p>
            </div>
            <ChevronUp
              className={cn(
                "h-4 w-4 text-zinc-500 transition-transform duration-200",
                showUserMenu ? "rotate-180" : ""
              )}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 hover:border-white/20 transition-all duration-200"
      title="Open sidebar"
    >
      <PanelLeft className="h-5 w-5" />
    </button>
  );
}
