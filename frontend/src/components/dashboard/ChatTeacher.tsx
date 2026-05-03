"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, BrainCircuit, Loader2, Minus, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatTeacher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am Professor Intel, your AI Engineering Mentor. How can I help you with your studies today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await apiClient.post("/chat", { 
        message: userMessage, 
        history: messages.map(m => ({ role: m.role, content: m.content })) 
      });
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: response.data.response 
      }]);
      setIsLoading(false);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please ensure the backend server is running." 
      }]);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-500/40 transition-all",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageSquare className="h-8 w-8" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            className={cn(
              "fixed bottom-8 right-8 z-50 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl transition-all",
              isMinimized ? "h-16 w-80" : "h-[600px] w-[400px]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Professor Intel</h3>
                  <p className="text-[10px] text-blue-100 uppercase tracking-widest font-bold">AI Engineering Mentor</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded">
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6 scrollbar-hide">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        msg.role === "user" ? "bg-slate-700" : "bg-blue-600/20 text-blue-400"
                      )}>
                        {msg.role === "user" ? <User className="h-4 w-4" /> : <BrainCircuit className="h-4 w-4" />}
                      </div>
                      <div className={cn(
                        "max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed",
                        msg.role === "user" ? "bg-blue-600 text-white" : "bg-white/5 text-slate-300"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                        <BrainCircuit className="h-4 w-4" />
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-white/5 p-4">
                  <div className="flex gap-2 bg-white/5 rounded-2xl p-2 border border-white/10 focus-within:border-blue-500/50 transition-all">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask Professor Intel..."
                      className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-500"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!message.trim() || isLoading}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-center text-slate-500 italic">Focused on Engineering Excellence</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
