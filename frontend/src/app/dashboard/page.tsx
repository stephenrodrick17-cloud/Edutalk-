"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, BookOpen, AlertCircle, Calendar, CheckCircle2, BrainCircuit, BarChart3, PieChart, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { cn } from "@/lib/utils";

import Link from "next/link";

const stats = [
  { label: "Technical Readiness", value: "84%", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Formula Mastery", value: "62%", icon: BookOpen, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  { label: "High-Yield Topics", value: "12", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Design Risks", value: "4", icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
];

const data = [
  { name: "Thermodynamics", freq: 400, predicted: 240 },
  { name: "Fluid Mechanics", freq: 300, predicted: 139 },
  { name: "Structural Analysis", freq: 200, predicted: 980 },
  { name: "Material Science", freq: 278, predicted: 390 },
  { name: "Heat Transfer", freq: 189, predicted: 480 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Engineering Analysis Dashboard</h1>
          <p className="text-slate-400">Past paper insights for <span className="text-white font-medium">Mechanical Engineering - Batch 2026</span></p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
           <div className="h-12 w-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
              <Calendar className="h-6 w-6" />
           </div>
           <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Days to Finals</p>
              <p className="text-xl font-bold">14 Days</p>
           </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8 flex flex-col md:flex-row items-center gap-8"
      >
        <div className="h-20 w-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/40 shrink-0">
           <BrainCircuit className="h-10 w-10 text-white" />
        </div>
        <div className="flex-1 space-y-2">
           <h3 className="text-xl font-bold flex items-center gap-2 text-gradient">
              AI Strategic Insight
              <span className="text-xs font-bold uppercase tracking-widest bg-blue-600 px-2 py-0.5 rounded text-white">Critical</span>
           </h3>
           <p className="text-slate-400 leading-relaxed">
              Our analysis of <b>6 past papers</b> shows a 25% increase in questions related to <span className="text-white font-semibold">Graph Theory</span> in the last 2 years. 
              We recommend prioritizing <b>Unit 4</b> this week to maximize your score potential.
           </p>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto">
           <Link href="/dashboard/planner" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all whitespace-nowrap text-center">
              Update Study Plan
           </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Detailed Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div className="rounded-3xl border border-white/5 bg-white/5 p-8">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Year-wise Difficulty Distribution
           </h3>
           <div className="space-y-6">
              {[
                { year: "2024", easy: 20, medium: 50, hard: 30 },
                { year: "2023", easy: 30, medium: 40, hard: 30 },
                { year: "2022", easy: 15, medium: 45, hard: 40 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-300">{item.year} Exam</span>
                      <span className="text-slate-500 text-xs">Hard: {item.hard}%</span>
                   </div>
                   <div className="flex h-3 w-full rounded-full overflow-hidden bg-white/5">
                      <div className="bg-emerald-500 h-full" style={{ width: `${item.easy}%` }} />
                      <div className="bg-blue-500 h-full" style={{ width: `${item.medium}%` }} />
                      <div className="bg-rose-500 h-full" style={{ width: `${item.hard}%` }} />
                   </div>
                </div>
              ))}
              <div className="flex gap-4 mt-4 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                 <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Easy</div>
                 <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-500" /> Medium</div>
                 <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-rose-500" /> Hard</div>
              </div>
           </div>
        </motion.div>

        <motion.div className="rounded-3xl border border-white/5 bg-white/5 p-8">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-400" />
              Syllabus Coverage Gaps
           </h3>
           <div className="grid grid-cols-2 gap-4">
              {[
                { topic: "Finite Element Method", status: "Low Frequency", risk: "High" },
                { topic: "Vibrations & Noise", status: "Untouched", risk: "Critical" },
                { topic: "CAD/CAM Systems", status: "Untouched", risk: "Medium" },
                { topic: "Kinematics", status: "High Frequency", risk: "Low" },
              ].map((gap, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-sm font-bold truncate">{gap.topic}</p>
                   <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">{gap.status}</span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded",
                        gap.risk === "Critical" ? "bg-rose-500/10 text-rose-500" : 
                        gap.risk === "High" ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"
                      )}>{gap.risk} Risk</span>
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-6 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex gap-3">
              <Info className="h-5 w-5 text-indigo-400 shrink-0" />
              <p className="text-xs text-slate-400">These topics have not appeared in the last 3 years but are mandatory in the 2026 syllabus update.</p>
           </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Topic Frequency Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 rounded-3xl border border-white/5 bg-white/5 p-8"
        >
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-xl font-bold">Topic Frequency vs Predictions</h3>
                <p className="text-sm text-slate-400">Based on analysis of 5 years of past papers</p>
             </div>
             <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none">
                <option>Computer Science</option>
                <option>Mathematics</option>
             </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="freq" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFreq)" strokeWidth={3} />
                <Area type="monotone" dataKey="predicted" stroke="#6366f1" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Study Tasks */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-white/5 bg-white/5 p-8"
        >
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold">Today's Focus</h3>
             <Calendar className="h-5 w-5 text-slate-500" />
          </div>
          <div className="space-y-4">
             {[
               { title: "Review 'Navier-Stokes Equations'", time: "10:00 AM", priority: "High" },
               { title: "Solve 2024 Strength of Materials Paper", time: "02:00 PM", priority: "Medium" },
               { title: "Derive Euler-Bernoulli Beam Theory", time: "05:00 PM", priority: "High" },
               { title: "Practice Circuit Analysis Problems", time: "08:00 PM", priority: "Low" },
             ].map((task, i) => (
               <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 group-hover:border-blue-500 transition-colors">
                     <CheckCircle2 className="h-4 w-4 text-transparent group-hover:text-blue-500" />
                  </div>
                  <div className="flex-1">
                     <p className="text-sm font-medium">{task.title}</p>
                     <p className="text-xs text-slate-500">{task.time}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md",
                    task.priority === "High" ? "bg-rose-500/10 text-rose-500" : 
                    task.priority === "Medium" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    {task.priority}
                  </span>
               </div>
             ))}
          </div>
          <button className="w-full mt-6 py-4 rounded-2xl bg-blue-600 font-bold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
             View Full Planner
          </button>
        </motion.div>
      </div>
    </div>
  );
}
