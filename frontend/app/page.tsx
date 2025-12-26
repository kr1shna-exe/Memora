"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!user;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-[-20%] top-[10%] w-[80%] h-[70%]"
          initial={{ opacity: 0, x: "-30%" }}
          animate={{ opacity: 1, x: "0%" }}
          transition={{
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.2,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  ellipse 80% 60% at 10% 40%,
                  rgba(29, 78, 216, 0.4) 0%,
                  rgba(59, 130, 246, 0.3) 30%,
                  rgba(30, 64, 175, 0.15) 60%,
                  transparent 80%
                )
              `,
              filter: "blur(40px)",
            }}
            animate={{
              opacity: [1, 0.85, 1],
            }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>

        <motion.div
          className="absolute left-[-15%] top-[15%] w-[70%] h-[60%]"
          initial={{ opacity: 0, x: "-40%" }}
          animate={{ opacity: 1, x: "0%" }}
          transition={{
            duration: 3,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.5,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  ellipse 70% 50% at 20% 50%,
                  rgba(59, 130, 246, 0.5) 0%,
                  rgba(96, 165, 250, 0.35) 25%,
                  rgba(29, 78, 216, 0.2) 50%,
                  transparent 75%
                )
              `,
              filter: "blur(50px)",
            }}
            animate={{
              opacity: [0.9, 1, 0.9],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="riverGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(29, 78, 216, 0)" />
              <stop offset="8%" stopColor="rgba(29, 78, 216, 0.35)" />
              <stop offset="25%" stopColor="rgba(59, 130, 246, 0.6)" />
              <stop offset="50%" stopColor="rgba(96, 165, 250, 0.5)" />
              <stop offset="75%" stopColor="rgba(59, 130, 246, 0.35)" />
              <stop offset="92%" stopColor="rgba(29, 78, 216, 0.15)" />
              <stop offset="100%" stopColor="rgba(29, 78, 216, 0)" />
            </linearGradient>
            <linearGradient id="riverGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
              <stop offset="12%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="35%" stopColor="rgba(29, 78, 216, 0.5)" />
              <stop offset="65%" stopColor="rgba(96, 165, 250, 0.4)" />
              <stop offset="88%" stopColor="rgba(29, 78, 216, 0.15)" />
              <stop offset="100%" stopColor="rgba(29, 78, 216, 0)" />
            </linearGradient>
            <linearGradient id="riverGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(96, 165, 250, 0)" />
              <stop offset="15%" stopColor="rgba(96, 165, 250, 0.25)" />
              <stop offset="40%" stopColor="rgba(59, 130, 246, 0.4)" />
              <stop offset="70%" stopColor="rgba(29, 78, 216, 0.3)" />
              <stop offset="90%" stopColor="rgba(29, 78, 216, 0.1)" />
              <stop offset="100%" stopColor="rgba(29, 78, 216, 0)" />
            </linearGradient>
            <filter id="glow1" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="20" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="15" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow3" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.path
            d="M -150 120
               C 50 100, 200 160, 350 220
               C 500 280, 650 340, 800 380
               C 950 420, 1100 440, 1250 450"
            stroke="url(#riverGradient1)"
            strokeWidth="120"
            fill="none"
            filter="url(#glow1)"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.75 }}
            transition={{
              pathLength: { duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
              opacity: { duration: 1.5, delay: 0.3 },
            }}
          />

          <motion.path
            d="M -120 220
               C 60 210, 200 260, 340 320
               C 480 380, 620 430, 760 470
               C 900 510, 1040 540, 1180 560"
            stroke="url(#riverGradient2)"
            strokeWidth="90"
            fill="none"
            filter="url(#glow2)"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{
              pathLength: { duration: 2.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 },
              opacity: { duration: 1.5, delay: 0.5 },
            }}
          />

          <motion.path
            d="M -100 320
               C 70 320, 200 360, 330 410
               C 460 460, 590 510, 720 550
               C 850 590, 980 620, 1110 640"
            stroke="url(#riverGradient3)"
            strokeWidth="70"
            fill="none"
            filter="url(#glow3)"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.45 }}
            transition={{
              pathLength: { duration: 3.1, ease: [0.22, 1, 0.36, 1], delay: 0.7 },
              opacity: { duration: 1.5, delay: 0.7 },
            }}
          />

          <motion.path
            d="M -80 420
               C 80 430, 200 460, 320 500
               C 440 540, 560 580, 680 620
               C 800 660, 920 690, 1040 710"
            stroke="url(#riverGradient2)"
            strokeWidth="100"
            fill="none"
            filter="url(#glow2)"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{
              pathLength: { duration: 3.4, ease: [0.22, 1, 0.36, 1], delay: 0.9 },
              opacity: { duration: 1.5, delay: 0.9 },
            }}
          />
        </svg>

        <motion.div
          className="absolute left-[35%] top-[38%] w-[250px] h-[250px]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{
            duration: 2,
            ease: "easeOut",
            delay: 2.5,
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(29, 78, 216, 0.15) 50%, transparent 70%)",
              filter: "blur(50px)",
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>
      </div>

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(29, 78, 216, 0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <header className="relative z-50">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <button
            className="flex cursor-pointer md:hidden items-center justify-center p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-0 top-20 z-50 mx-4 rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {!isLoggedIn && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-medium text-zinc-300 hover:text-white border border-white/10 rounded-xl transition-colors"
                >
                  Login
                </Link>
              )}
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            <span className="text-sm font-medium text-blue-300">
              An Agentic Memory Engine
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="text-white">Your mind, </span>
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
              extended
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Memora learns from your conversations, remembers what matters, and
            retrieves information exactly when you need it.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href={isLoggedIn ? "/dashboard" : "/login"}>
              <motion.button
                className="group relative flex cursor-pointer items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-full  transition-all duration-500 overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">Start Building Memories</span>
                <ArrowUpRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.button>
            </Link>

            <Link href={isLoggedIn ? "/dashboard" : "/login"}>
              <motion.button
                className="group flex items-center cursor-pointer gap-2 px-8 py-4 text-base font-semibold text-zinc-300 border border-white/10 hover:border-blue-500/50 rounded-full backdrop-blur-sm hover:bg-white/5 transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Watch Demo</span>
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 group-hover:bg-blue-500/20 transition-colors">
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {["Episodic", "Semantic", "Procedural"].map((type, index) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-2 text-sm text-zinc-500"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>{type} Memory</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-zinc-600"
          >
            <div className="w-5 h-8 rounded-full border-2 border-zinc-700 flex justify-center pt-1.5">
              <motion.div
                className="w-1 h-1.5 rounded-full bg-zinc-600"
                animate={{ y: [0, 4, 0], opacity: [1, 0.5, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
    </div>
  );
}
