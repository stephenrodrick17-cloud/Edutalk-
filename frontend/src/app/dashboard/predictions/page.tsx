"use client";

import { motion } from "framer-motion";
import { BrainCircuit, TrendingUp, Info, Star, ChevronRight, Target, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const predictedTopics = [
  { 
    name: "Asymptotic Analysis", 
    probability: 95, 
    importance: "Critical", 
    marksWeight: "15-20", 
    trend: "Increasing",
    reason: "Appeared in 4 out of last 5 years with increasing mark distribution."
  },
  { 
    name: "Dynamic Programming", 
    probability: 88, 
    importance: "High", 
    marksWeight: "10-15", 
    trend: "Stable",
    reason: "Consistently appears in Section C (Long Questions)."
  },
  { 
    name: "Graph Traversal (BFS/DFS)", 
    probability: 82, 
    importance: "High", 
    marksWeight: "8-12", 
    trend: "Increasing",
    reason: "Recent shift towards practical implementation questions."
  },
  { 
    name: "B-Trees and Indexing", 
    probability: 75, 
    importance: "Medium", 
    marksWeight: "5-10", 
    trend: "Decreasing",
    reason: "Frequency slightly lower in last 2 years, but still a core concept."
  },
];

export default function PredictionsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Topic Forecasting</h1>
          <p className="text-slate-400">Advanced prediction model trained on 2018-2024 engineering paper datasets.</p>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-xs font-bold text-slate-300">Live Prediction Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Prediction List */}
        <div className="lg:col-span-3 space-y-6">
           <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center gap-4">
              <AlertTriangle className="h-6 w-6 text-blue-400" />
              <p className="text-sm text-slate-300">
                 <b>Professor's Note:</b> This year shows a high correlation with the 2021 exam pattern. Focus heavily on <b>Section C</b> application questions.
              </p>
           </div>

          {predictedTopics.map((topic, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-3xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-6">
                  <div className="h-16 w-16 rounded-2xl bg-blue-600/10 flex flex-col items-center justify-center text-blue-500 border border-blue-500/20">
                     <span className="text-xl font-bold">{topic.probability}%</span>
                     <span className="text-[10px] uppercase tracking-tighter">Prob.</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                      {topic.name}
                      {topic.probability > 90 && <Star className="h-4 w-4 fill-amber-500 text-amber-500" />}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                       <span className={cn(
                         "px-2 py-0.5 rounded-md font-bold text-[10px] uppercase",
                         topic.importance === "Critical" ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                       )}>
                         {topic.importance} Importance
                       </span>
                       <span className="text-slate-500 flex items-center gap-1">
                         <Target className="h-3 w-3" /> {topic.marksWeight} Marks
                       </span>
                       <span className="text-slate-500 flex items-center gap-1">
                         <TrendingUp className="h-3 w-3" /> {topic.trend} Trend
                       </span>
                    </div>
                  </div>
                </div>
                <Link 
                  href={`/dashboard/practice?topic=${encodeURIComponent(topic.name)}`}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                >
                   <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
              
              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-3">
                 <Info className="h-5 w-5 text-blue-400 shrink-0" />
                 <p className="text-sm text-slate-400 italic">“{topic.reason}”</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
           <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
              <BrainCircuit className="h-10 w-10 mb-6 opacity-80" />
              <h3 className="text-xl font-bold mb-2">Confidence Score</h3>
              <p className="text-sm text-blue-100 mb-6">Our models have an 89% accuracy rate based on previous exam cycles.</p>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white w-[89%]" />
              </div>
              <p className="text-[10px] mt-2 text-blue-200 text-right font-bold uppercase tracking-widest">Enterprise Grade AI</p>
           </div>

           <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
              <h3 className="font-bold mb-4">Historical Reliability</h3>
              <div className="space-y-4">
                 {[
                   { label: "2024 Prediction", accuracy: "92%" },
                   { label: "2023 Prediction", accuracy: "88%" },
                   { label: "2022 Prediction", accuracy: "85%" },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                         <CheckCircle className="h-3 w-3" /> {item.accuracy}
                      </span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
              <h3 className="font-bold mb-4">Model Parameters</h3>
              <div className="space-y-4">
                 {[
                   { label: "Frequency Analysis", value: "High Weight" },
                   { label: "Recency Factor", value: "Medium Weight" },
                   { label: "Syllabus Weightage", value: "High Weight" },
                   { label: "Trend Growth", value: "Low Weight" },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-bold text-slate-300">{item.value}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
