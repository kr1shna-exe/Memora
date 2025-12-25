"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Key,
  Trash2,
  Save,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "../layout";

export default function SettingsPage() {
  const { sidebarCollapsed } = useDashboard();
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
  });

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
        <div className="mx-auto max-w-2xl space-y-6 pt-4">
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20">
                <User className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-base font-medium text-zinc-100">Profile</h2>
                <p className="text-xs text-zinc-500">
                  Update your account details
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <button className="rounded-xl cursor-pointer border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                    Change Avatar
                  </button>
                  <p className="mt-2 text-xs text-zinc-500">
                    JPG, PNG or GIF. Max 2MB
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-white/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-white/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button className="flex items-center gap-2 cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20 transition-all duration-200">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20">
                <Key className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-base font-medium text-zinc-100">Security</h2>
                <p className="text-xs text-zinc-500">
                  Manage your account security
                </p>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-zinc-200">Password</p>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      Last changed 3 months ago
                    </p>
                  </div>
                  <button className="rounded-lg border cursor-pointer border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-zinc-100 transition-all duration-200">
                    Change
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-zinc-200">
                        Two-Factor Authentication
                      </p>
                      <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      Add an extra layer of security
                    </p>
                  </div>
                  <button className="rounded-lg border cursor-pointer border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-zinc-100 transition-all duration-200">
                    Enable
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-zinc-200">Active Sessions</p>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      Manage devices logged into your account
                    </p>
                  </div>
                  <button className="rounded-lg border cursor-pointer border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-zinc-100 transition-all duration-200">
                    View
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.02] backdrop-blur-xl overflow-hidden">
            <div className="p-6">
              <p className="font-medium text-red-400">Danger Zone</p>
              <p className="mt-1 text-sm text-zinc-500">
                Permanently delete your account and all data
              </p>
              <button className="mt-4 cursor-pointer rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 text-sm font-medium text-white hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/20 transition-all duration-200">
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
