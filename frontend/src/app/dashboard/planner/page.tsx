"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronRight, BrainCircuit, Sparkles, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PlannerPage() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("latest_analysis");
    if (saved) {
      setAnalysisData(JSON.parse(saved));
    }
  }, []);

  const generatedPlan = analysisData?.questions?.slice(0, 5).map((q: any, i: number) => ({
    day: i + 1,
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    topics: [q.topic || "General Topic"],
    tasks: [`Solve question: ${q.text?.substring(0, 40) || "Extracted question"}...`, `Master concepts of ${q.topic || "this topic"}`],
    priority: q.marks > 10 ? "Critical" : "High",
    status: i === 0 ? "in-progress" : "pending"
  })) || [
    {
      day: 1,
      date: "May 4, 2026",
      topics: ["Asymptotic Analysis", "Time Complexity"],
      tasks: ["Review Big O Notation", "Solve 5 recursive complexity problems"],
      priority: "Critical",
      status: "completed"
    },
    {
      day: 2,
      date: "May 5, 2026",
      topics: ["Dynamic Programming", "Memoization"],
      tasks: ["Knapsack Problem variants", "Longest Common Subsequence"],
      priority: "High",
      status: "in-progress"
    },
    {
      day: 3,
      date: "May 6, 2026",
      topics: ["Graph Algorithms", "Dijkstra"],
      tasks: ["Shortest path theory", "Implement BFS/DFS comparison"],
      priority: "High",
      status: "pending"
    },
    {
      day: 4,
      date: "May 7, 2026",
      topics: ["Revision", "Mock Test 1"],
      tasks: ["Timed mock test (2023 Paper)", "Identify weak areas from results"],
      priority: "Medium",
      status: "pending"
    }
  ];

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Smart Study Planner</h1>
          <p className="text-slate-400">
            {analysisData 
              ? `Personalized roadmap for ${analysisData.subject}.`
              : "AI-optimized schedule based on topic frequency and your weak areas."}
          </p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all">
              <Filter className="h-4 w-4" /> Filter
           </button>
           <button 
             onClick={handleRegenerate}
             disabled={isGenerating}
             className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
           >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Re-generate with AI
                </>
              )}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Planner Sidebar */}
        <div className="space-y-6">
           <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                 <BrainCircuit className="h-5 w-5 text-blue-400" />
                 AI Strategy
              </h3>
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Focus</p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {analysisData 
                        ? `Prioritizing ${analysisData.questions[0]?.topic} based on detected marks.`
                        : "Prioritizing Unit 3 and Unit 5 as they account for 45% of historical marks."}
                    </p>
                 </div>
              </div>
           </div>

           <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
              <h3 className="font-bold mb-4">Exam Countdown</h3>
              <div className="flex items-center justify-between mb-4">
                 <span className="text-slate-400 text-sm">Days Left</span>
                 <span className="text-2xl font-bold text-white">14</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 w-[60%]" />
              </div>
              <p className="text-[10px] mt-2 text-slate-500 text-center uppercase tracking-widest">60% Syllabus Covered</p>
           </div>
        </div>

        {/* Main Schedule */}
        <div className="lg:col-span-3 space-y-4">
           {generatedPlan.map((item: any, i: number) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className={cn(
                 "group relative flex items-stretch gap-6 p-6 rounded-3xl border transition-all",
                 item.status === "completed" ? "bg-emerald-500/5 border-emerald-500/20" : 
                 item.status === "in-progress" ? "bg-blue-500/5 border-blue-500/20 shadow-lg shadow-blue-500/5" : "bg-white/5 border-white/5 hover:bg-white/10"
               )}
             >
               {/* Timeline Dot */}
               <div className="flex flex-col items-center">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center border-2 shrink-0",
                    item.status === "completed" ? "bg-emerald-500 border-emerald-500 text-white" : 
                    item.status === "in-progress" ? "bg-blue-600 border-blue-600 text-white" : "border-white/10 text-slate-500"
                  )}>
                    {item.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : <span>{item.day}</span>}
                  </div>
                  <div className="w-px h-full bg-white/5 mt-2" />
               </div>

               <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="text-xl font-bold">Day {item.day}: {item.topics.join(" & ")}</h3>
                           <span className={cn(
                             "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                             item.priority === "Critical" ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                           )}>
                             {item.priority}
                           </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                           <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {item.date}</span>
                           <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 4 Hours Study</span>
                        </div>
                     </div>
                     <Link 
                       href={`/dashboard/practice?topic=${encodeURIComponent(item.topics[0])}`}
                       className="p-2 rounded-xl hover:bg-white/10 transition-all"
                     >
                        <ChevronRight className="h-5 w-5 text-slate-500" />
                     </Link>
                  </div>

                  <div className="space-y-2">
                     {item.tasks.map((task: any, j: number) => (
                       <div key={j} className="flex items-center gap-3 text-sm text-slate-400">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            item.status === "completed" ? "bg-emerald-500" : "bg-slate-600"
                          )} />
                          {task}
                       </div>
                     ))}
                  </div>
               </div>
             </motion.div>
           ))}

           <button className="w-full py-6 rounded-3xl border-2 border-dashed border-white/5 text-slate-500 font-medium hover:border-white/20 hover:text-white transition-all">
              + Add a custom study block
           </button>
        </div>
      </div>
    </div>
  );
}
