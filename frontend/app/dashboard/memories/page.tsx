"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Layers,
  TrendingUp,
  Calendar,
  MoreVertical,
  Trash2,
  ChevronLeft,
  ExternalLink,
  Brain,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useDashboard } from "../layout";

type MemoryType = "all" | "episodic" | "semantic" | "procedural";

interface Memory {
  id: string;
  content: string;
  type: "episodic" | "semantic" | "procedural";
  timestamp: Date;
  tags: string[];
  source?: string;
}

const mockMemories: Memory[] = [
  {
    id: "1",
    content: "User prefers dark mode in all applications and websites",
    type: "semantic",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    tags: ["preference", "ui"],
  },
  {
    id: "2",
    content:
      "Had a meeting with the design team about the new dashboard layout. Key decisions: use card-based layout, implement dark mode, add keyboard shortcuts.",
    type: "episodic",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    tags: ["meeting", "design", "dashboard"],
    source: "Chat - Dec 24",
  },
  {
    id: "3",
    content:
      "User typically starts work around 9 AM and prefers morning for deep work sessions",
    type: "procedural",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    tags: ["work pattern", "schedule"],
  },
  {
    id: "4",
    content: "Favorite programming languages: TypeScript, Python, Rust",
    type: "semantic",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    tags: ["programming", "skills"],
  },
  {
    id: "5",
    content:
      "Discussed project timeline for Q1 2025. Main milestones: MVP by Jan 15, Beta by Feb 1, Launch by Feb 28.",
    type: "episodic",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    tags: ["project", "timeline", "planning"],
    source: "Chat - Dec 22",
  },
  {
    id: "6",
    content:
      "User responds better to bullet points and concise explanations rather than long paragraphs",
    type: "procedural",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    tags: ["communication", "preference"],
  },
];

const memoryTypeConfig = {
  episodic: {
    label: "Episodic",
    icon: Clock,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    gradient: "from-cyan-500/20 to-cyan-600/10",
  },
  semantic: {
    label: "Semantic",
    icon: Layers,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    gradient: "from-amber-500/20 to-amber-600/10",
  },
  procedural: {
    label: "Procedural",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500/20 to-emerald-600/10",
  },
};

export default function MemoriesPage() {
  const { sidebarCollapsed } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<MemoryType>("all");
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);

  const filteredMemories = mockMemories.filter((memory) => {
    const matchesSearch =
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFilter =
      activeFilter === "all" || memory.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filters: { value: MemoryType; label: string; count: number }[] = [
    { value: "all", label: "All", count: mockMemories.length },
    {
      value: "episodic",
      label: "Episodic",
      count: mockMemories.filter((m) => m.type === "episodic").length,
    },
    {
      value: "semantic",
      label: "Semantic",
      count: mockMemories.filter((m) => m.type === "semantic").length,
    },
    {
      value: "procedural",
      label: "Procedural",
      count: mockMemories.filter((m) => m.type === "procedural").length,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-[#0a0a0b]">
      <header className={cn(
        "sticky top-0 z-10 px-4 py-3",
        sidebarCollapsed && "pl-16"
      )}>
        <div className="flex items-center justify-between mt-3 ml-2">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="pt-4 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl pl-11 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-white/20 transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all duration-200",
                    activeFilter === filter.value
                      ? "bg-blue-500/20 border-blue-500/30 text-blue-300"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:border-white/20 hover:text-zinc-200"
                  )}
                >
                  {filter.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-xs",
                      activeFilter === filter.value
                        ? "bg-blue-500/30 text-blue-200"
                        : "bg-white/10 text-zinc-500"
                    )}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredMemories.map((memory, index) => {
            const config = memoryTypeConfig[memory.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div
                  className={cn(
                    "group relative rounded-2xl border bg-white/[0.02] backdrop-blur-xl p-5 cursor-pointer transition-all duration-200",
                    selectedMemory === memory.id
                      ? "border-blue-500/50 bg-blue-500/[0.05] ring-1 ring-blue-500/20"
                      : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                  )}
                  onClick={() =>
                    setSelectedMemory(
                      selectedMemory === memory.id ? null : memory.id
                    )
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br border",
                      config.gradient,
                      config.border
                    )}>
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200 transition-all duration-200">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
                    {memory.content}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {memory.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-zinc-500">
                      {formatRelativeTime(memory.timestamp)}
                    </span>
                    {memory.source && (
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <ExternalLink className="h-3 w-3" />
                        {memory.source}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredMemories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
              <Brain className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-200">
              No memories found
            </h3>
            <p className="mt-2 text-sm text-zinc-500 max-w-sm">
              Try adjusting your search or filter criteria to find what you're looking for
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
