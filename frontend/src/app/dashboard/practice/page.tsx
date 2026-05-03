"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Sparkles, ChevronRight, BookOpen, Lightbulb, CheckCircle2, Loader2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PracticePage() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [topic, setTopic] = useState("All Topics");
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("latest_analysis");
    if (saved) {
      setAnalysisData(JSON.parse(saved));
    }
  }, []);

  const questions = analysisData?.questions?.map((q: any, idx: number) => ({
    id: idx + 1,
    text: q.text,
    marks: q.marks,
    topic: q.topic,
    difficulty: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1),
    hint: `Focus on ${q.topic} core principles.`,
    markingScheme: q.solution || "Refer to standard engineering marking criteria."
  })) || [
    {
      id: 1,
      text: "Explain the difference between Big O, Big Omega, and Big Theta notations with examples.",
      marks: 10,
      topic: "Asymptotic Analysis",
      difficulty: "Medium",
      hint: "Think about upper bound, lower bound, and tight bound.",
      markingScheme: "2 marks for each definition, 4 marks for examples."
    },
    // ...
  ];

  const filteredQuestions = topic === "All Topics" 
    ? questions 
    : questions.filter((q: any) => q.topic === topic);

  const topicsList = analysisData 
    ? ["All Topics", ...Array.from(new Set(analysisData.questions.map((q: any) => q.topic)))]
    : ["All Topics", "Asymptotic Analysis", "Dynamic Programming", "Graph Algorithms"];

  const generateNew = (overrideTopic?: string) => {
    const targetTopic = overrideTopic || topic;
    setLoading(true);
    
    // Simulate API call to generate questions for the target topic
    setTimeout(() => {
      setLoading(false);
      if (analysisData) {
        // If we have real data, we just filter or "regenerate" from existing context
        setTopic(targetTopic);
      }
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Practice Questions</h1>
          <p className="text-slate-400">
            {analysisData 
              ? `Generated questions based on ${analysisData.subject} analysis.` 
              : "Generate exam-style questions tailored to high-yield topics."}
          </p>
        </div>
        <div className="flex gap-3">
           <select 
             value={topic}
             onChange={(e) => setTopic(e.target.value)}
             className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none max-w-[200px]"
           >
              {topicsList.map((t: any) => (
                <option key={t} value={t}>{t}</option>
              ))}
           </select>
           <button 
             onClick={() => generateNew()}
             disabled={loading}
             className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
           >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate New
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Questions List */}
        <div className="lg:col-span-2 space-y-6">
           <AnimatePresence mode="popLayout">
             {filteredQuestions.map((q: any, i: number) => (
               <motion.div
                 key={q.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className={cn(
                   "group rounded-3xl border transition-all p-6 cursor-pointer",
                   activeQuestion === q.id ? "bg-blue-600/5 border-blue-500/30" : "bg-white/5 border-white/5 hover:bg-white/10"
                 )}
                 onClick={() => setActiveQuestion(activeQuestion === q.id ? null : q.id)}
               >
                 {/* ... content similar but using dynamic filteredQuestions */}

                 <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                       <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 shrink-0">
                          <HelpCircle className="h-5 w-5" />
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-2">
                             <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                                Question {i + 1}
                             </span>
                             <span className={cn(
                               "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                               q.difficulty === "Hard" ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                             )}>
                               {q.difficulty}
                             </span>
                          </div>
                          <p className="text-lg font-medium leading-relaxed">{q.text}</p>
                       </div>
                    </div>
                    <div className="text-right shrink-0">
                       <p className="text-xl font-bold">{q.marks}</p>
                       <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Marks</p>
                    </div>
                 </div>

                 <AnimatePresence>
                   {activeQuestion === q.id && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: "auto", opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden"
                     >
                       <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                             <div className="flex items-center gap-2 mb-2 text-amber-500">
                                <Lightbulb className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Hint</span>
                             </div>
                             <p className="text-sm text-slate-400 italic">{q.hint}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                             <div className="flex items-center gap-2 mb-2 text-blue-500">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Marking Scheme</span>
                             </div>
                             <p className="text-sm text-slate-400">{q.markingScheme}</p>
                          </div>
                       </div>
                       <div className="mt-4 flex justify-end">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              generateNew(q.topic);
                            }}
                            className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                          >
                             Practice this topic <ChevronRight className="h-4 w-4" />
                          </button>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
           <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white">
              <Sparkles className="h-10 w-10 mb-6 opacity-80" />
              <h3 className="text-xl font-bold mb-2">AI Recommendation</h3>
              <p className="text-sm text-blue-100 mb-6">Based on your recent analysis, you should focus on <b>Dynamic Programming</b> as it has the highest mark potential in the upcoming exam.</p>
              <button 
                onClick={() => generateNew("Dynamic Programming")}
                className="w-full py-3 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all"
              >
                 Generate DP Set
              </button>
           </div>

           <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
              <h3 className="font-bold mb-4">Topic Mastery</h3>
              <div className="space-y-4">
                 {[
                   { label: "Asymptotic Analysis", value: 85 },
                   { label: "Dynamic Programming", value: 42 },
                   { label: "Graph Algorithms", value: 68 },
                 ].map((topic, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs">
                         <span className="text-slate-400">{topic.label}</span>
                         <span className="text-white font-medium">{topic.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-blue-500 rounded-full" 
                           style={{ width: `${topic.value}%` }} 
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
