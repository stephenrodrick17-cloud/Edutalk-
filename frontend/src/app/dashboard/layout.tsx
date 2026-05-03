"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, LayoutDashboard, FileUp, LineChart, Calendar, Settings, LogOut, Search, Bell, BookOpen, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ChatTeacher from "@/components/dashboard/ChatTeacher";
import { useEffect, useState } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Detailed Analysis", href: "/dashboard" },
  { icon: FileUp, label: "Upload Engineering Papers", href: "/dashboard/upload" },
  { icon: LineChart, label: "Topic Forecasting", href: "/dashboard/predictions" },
  { icon: BookOpen, label: "AI Practice Sets", href: "/dashboard/practice" },
  { icon: Calendar, label: "Study Roadmap", href: "/dashboard/planner" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const searchSuggestions = [
    { label: "Asymptotic Analysis", href: "/dashboard/practice?topic=Asymptotic%20Analysis" },
    { label: "Dynamic Programming", href: "/dashboard/practice?topic=Dynamic%20Programming" },
    { label: "Upload Paper", href: "/dashboard/upload" },
    { label: "Study Roadmap", href: "/dashboard/planner" },
  ];

  const filteredSuggestions = searchQuery.trim() 
    ? searchSuggestions.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="flex min-h-screen signal-bg text-slate-50">
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 flex items-center gap-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4 text-blue-400 backdrop-blur-xl"
          >
            <Bell className="h-5 w-5" />
            <span className="text-sm font-bold">You have no new notifications.</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-slate-950/80 backdrop-blur-2xl">
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center gap-2 mb-10 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-500/20">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">ExamIntel AI</span>
          </div>

          <nav className="flex-1 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/5">
            <Link 
              href="/"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Exit to Home
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between px-8 bg-slate-950/40 backdrop-blur-md border-b border-white/5">
          <div className="relative">
            <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-4 py-2 w-96 border border-white/5 focus-within:border-blue-500/50 transition-all">
              <Search className="h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search papers, topics, questions..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-500"
              />
            </div>
            
            <AnimatePresence>
              {showSearchSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden"
                >
                  {filteredSuggestions.map((s, i) => (
                    <Link
                      key={i}
                      href={s.href}
                      className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-all"
                      onClick={() => {
                        setSearchQuery("");
                        setShowSearchSuggestions(false);
                      }}
                    >
                      <span className="text-sm font-medium">{s.label}</span>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
              }}
              className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <Bell className="h-5 w-5 text-slate-400" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 border-2 border-slate-950" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Alex Johnson</p>
                <p className="text-xs text-slate-500">Student ID: #2948</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold">
                AJ
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {children}
        </div>
        <ChatTeacher />
      </main>
    </div>
  );
}
