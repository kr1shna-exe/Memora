"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Brain,
  Sparkles,
  Loader2,
  Layers,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "./layout";
import { getConversation, createConversation, streamMessage } from "@/lib/api/conversations";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const { currentConversationId, setCurrentConversationId, setConversations, sidebarCollapsed } = useDashboard();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  useEffect(() => {
    if (!currentConversationId) {
      setMessages([]);
      return;
    }
    const convId = currentConversationId
    async function fetchMessages() {
      try {
        const data = await getConversation(convId);
        setMessages(data.messages);
      } catch (error) {
        console.log("Failed to fetch messages", error);
      }
    }
    fetchMessages();
  }, [currentConversationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const content = input.trim();
    setInput("");
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      let convId = currentConversationId;
      let isNewConversation = false;

      if (!convId) {
        const title = content.length > 50 ? content.slice(0, 50) + "..." : content;
        const newConv = await createConversation(title);
        setConversations((prev) => [newConv, ...prev]);
        convId = newConv.id;
        isNewConversation = true;
      }

      await streamMessage(
        convId,
        content,
        (userMsg) => {
          setMessages((prev) => [...prev, userMsg]);
          setIsStreaming(true);
          setIsTyping(false);
        },
        (chunk) => {
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (!lastMsg || lastMsg.role !== "assistant" || lastMsg.id !== -1) {
              return [
                ...prev,
                { id: -1, role: "assistant" as const, content: chunk, created_at: new Date().toISOString() }
              ];
            }
            return [...prev.slice(0, -1), { ...lastMsg, content: lastMsg.content + chunk }];
          });
        },
        (doneData) => {
          setMessages((prev) =>
            prev.map((msg) => msg.id === -1 ? { ...msg, id: doneData.id, created_at: doneData.created_at } : msg)
          );
          setIsStreaming(false);
        }
      );

      if (isNewConversation) {
        setCurrentConversationId(convId);
      }
    } catch (error) {
      console.log("Failed to send the message:", error);
    } finally {
      setIsTyping(false);
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isEmptyState = messages.length === 0 && !currentConversationId;

  return (
    <div className="flex h-full flex-col bg-[#0a0a0b]">
      <header className="sticky top-0 z-10 px-6 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center", sidebarCollapsed && "ml-12")}>
          </div>
          <Link
            href="/dashboard/memories"
            className="flex items-center gap-2.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 text-base text-zinc-400 hover:text-zinc-100 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            <Layers className="h-5 w-5" />
            <span className="hidden sm:inline">Memories</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {isEmptyState ? (
          <div className="flex h-full flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl"
            >
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl ">
                  <Brain className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-zinc-100 mb-2">
                What can I help you with today?
              </h1>
              <p className="text-zinc-500 text-sm">
                I remember our conversations and learn from them to assist you better.
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-6">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "mb-6",
                    message.role === "user" ? "flex justify-end" : ""
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20">
                        <Sparkles className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="prose prose-invert prose-sm max-w-none">
                          <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 pt-2">
                          <button className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200">
                            <Copy className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200">
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200">
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200">
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[85%]">
                      <div className="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 px-4 py-3">
                        <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && !isStreaming && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 mb-6"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex items-center gap-1.5 py-3">
                  <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 px-4 pb-4">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-end gap-3 rounded-2xl border-2 border-zinc-700/80 bg-zinc-800/50 backdrop-blur-xl p-3 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/40 transition-all duration-200">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className={cn(
                  "flex-1 resize-none bg-transparent text-sm text-zinc-200",
                  "placeholder:text-zinc-500",
                  "focus:outline-none",
                  "max-h-[200px]"
                )}
                style={{
                  minHeight: "28px",
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                  input.trim() && !isTyping
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-blue-400"
                    : "bg-white/5 border border-white/10 text-zinc-500 cursor-not-allowed"
                )}
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
          <p className="mt-3 text-center text-xs text-zinc-600">
            Memora learns from your conversations to provide personalized assistance
          </p>
        </div>
      </div>
    </div>
  );
}
