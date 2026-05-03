"use client";

import { motion } from "framer-motion";
import { BookOpen, BrainCircuit, BarChart3, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-center px-6 py-6">
        <div className="flex w-full max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-6 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">ExamIntel AI</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-slate-400 transition-colors hover:text-white">Features</Link>
            <Link href="/dashboard" className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 uppercase tracking-widest">
              Enter Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex w-full max-w-7xl flex-col items-center px-6 pt-32 pb-20 text-center md:pt-48 md:pb-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-20 opacity-30 pointer-events-none">
           <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent" />
           <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-40" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
          </span>
          AI-Powered Academic Intelligence
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
           className="relative mb-8"
         >
           <h1 className="text-7xl font-black tracking-tighter md:text-9xl uppercase leading-none text-white mix-blend-difference">
             Evolve
           </h1>
           <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full border border-blue-500/30 animate-pulse" />
           <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full border border-blue-500/20" />
         </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 max-w-2xl text-sm font-mono text-slate-500 md:text-base tracking-widest uppercase"
        >
          from shattered fragments to technical mastery <br/>
          leveraging neural networks to decode <br/>
          <span className="text-blue-500">the future of your engineering finals</span>
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/dashboard" className="group flex h-14 items-center gap-2 rounded-xl border border-white bg-white px-8 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-transparent hover:text-white">
            Access System
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/dashboard/upload" className="flex h-14 items-center rounded-xl border border-white/20 bg-transparent px-8 text-sm font-bold uppercase tracking-widest transition-all hover:bg-white/5">
            Analyze Paper
          </Link>
        </motion.div>

        {/* Hero Visual - Enhanced with 3D-like cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative mt-20 w-full max-w-6xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Neural Paper Parsing",
                img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
                desc: "OCR extracts complex engineering notation with 99% accuracy.",
                rotate: "-rotate-2"
              },
              {
                title: "3D Concept Mapping",
                img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800",
                desc: "Visualize syllabus coverage in a spatial knowledge graph.",
                rotate: "rotate-0",
                scale: 1.1,
                z: "z-10"
              },
              {
                title: "Predictive Synthesis",
                img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800",
                desc: "AI models forecasting high-yield topics for 2026.",
                rotate: "rotate-2"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -20, scale: 1.05 }}
                className={cn(
                  "relative group overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-1 transition-all duration-500",
                  card.rotate,
                  card.scale && "scale-110",
                  card.z
                )}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                  <img 
                    src={card.img} 
                    alt={card.title}
                    className="h-full w-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-left">
                    <h3 className="text-xl font-bold uppercase tracking-tighter text-white mb-2">{card.title}</h3>
                    <p className="text-xs text-slate-400 font-mono leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="absolute top-4 left-4 h-4 w-4 border-l border-t border-blue-500/50" />
                  <div className="absolute bottom-4 right-4 h-4 w-4 border-r border-b border-blue-500/50" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-10 -right-10 hidden lg:block p-4 border border-white/10 bg-slate-950/50 rounded-2xl backdrop-blur-md font-mono text-[10px] text-blue-400"
          >
            [SYSTEM_SCAN: ACTIVE]<br/>
            [TARGET: 2026_FINALS]<br/>
            [ANALYSIS: COMPLETED]
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full max-w-7xl px-6 py-20 bg-slate-950/50 backdrop-blur-3xl border-y border-white/5">
        <div className="mb-20 text-center">
           <h2 className="text-4xl font-bold uppercase tracking-widest mb-4">Core Intelligence Modules</h2>
           <div className="h-1 w-20 bg-blue-600 mx-auto" />
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-2">
          {[
            {
              icon: BrainCircuit,
              title: "Technical Extraction",
              desc: "Upload complex engineering diagrams or papers. Our OCR extracts formulas, units, and technical concepts.",
              img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800"
            },
            {
              icon: BarChart3,
              title: "Trend Analytics",
              desc: "Identify shifts in engineering exam patterns across multiple years and various universities.",
              img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800"
            },
            {
              icon: Calendar,
              title: "Adaptive Planning",
              desc: "Get a study schedule that prioritizes heavy-weight engineering units based on your time constraints.",
              img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800"
            },
            {
              icon: BookOpen,
              title: "Engineering Mentor",
              desc: "Chat with Professor Intel, our AI teacher trained to explain engineering formulas and concepts.",
              img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="relative w-full md:w-1/2 aspect-video overflow-hidden border border-white/10 rounded-2xl">
                 <img 
                   src={feature.img} 
                   alt={feature.title}
                   className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                 />
                 <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/50 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-mono text-sm">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-slate-950/50 py-12 px-6 mt-auto">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <BrainCircuit className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold">ExamIntel AI</span>
              </div>
              <p className="text-slate-400 max-w-sm mb-6">
                Empowering engineering students with AI-driven past paper analysis, 
                predictive trend mapping, and personalized study intelligence.
              </p>
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all cursor-pointer">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6">System</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/dashboard/upload" className="hover:text-white transition-colors">Paper Upload</Link></li>
                <li><Link href="/dashboard/predictions" className="hover:text-white transition-colors">Topic Predictions</Link></li>
                <li><Link href="/dashboard/planner" className="hover:text-white transition-colors">Study Planner</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API Status</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 text-xs text-slate-500 font-mono">
            <p>© 2026 EXAMINTEL AI. ALL SYSTEMS OPERATIONAL.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <span>v1.0.4-STABLE</span>
              <span>LATENCY: 12ms</span>
              <span>REGION: GLOBAL-1</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
