"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, X, CheckCircle2, Loader2, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setStatus("uploading");
    setProgress(10);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name);
        formData.append("subject", "General Engineering");
        formData.append("year", "2024");

        await apiClient.post("/upload-paper/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          params: { title: file.name, subject: "General Engineering", year: 2024 }
        });
        
        setProgress(prev => Math.min(prev + (100 / files.length), 90));
      }
      
      setProgress(100);
      setStatus("success");
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload Past Papers</h1>
        <p className="text-slate-400">Upload multiple PDFs or images. Our AI will automatically extract and analyze questions.</p>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all p-12 flex flex-col items-center justify-center gap-4",
          isDragging ? "border-blue-500 bg-blue-500/5" : "border-white/10 hover:border-white/20 bg-white/5"
        )}
      >
        <div className="h-16 w-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
          <FileUp className="h-8 w-8" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">Click to upload or drag and drop</p>
          <p className="text-sm text-slate-500 mt-1">PDF, PNG, JPG (max. 10MB per file)</p>
        </div>
        <input 
          type="file" 
          multiple 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files || [])])}
        />
      </div>

      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/5 bg-white/5 overflow-hidden"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold">Files to process ({files.length})</h3>
            <button 
              onClick={() => setFiles([])}
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {files.map((file, i) => (
              <div key={i} className="p-4 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(i)}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-500 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="p-6 bg-white/5 flex flex-col gap-4">
            {status === "uploading" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                   <span className="text-slate-400">Analyzing patterns...</span>
                   <span className="font-medium">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     className="h-full bg-blue-600 shadow-lg shadow-blue-500/50"
                   />
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={status === "uploading"}
              className={cn(
                "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
                status === "uploading" ? "bg-white/5 text-slate-500 cursor-not-allowed" : 
                status === "success" ? "bg-emerald-600 text-white" : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
              )}
            >
              {status === "idle" && <><FileUp className="h-5 w-5" /> Start Analysis</>}
              {status === "uploading" && <><Loader2 className="h-5 w-5 animate-spin" /> Processing with AI...</>}
              {status === "success" && <><CheckCircle2 className="h-5 w-5" /> Analysis Complete</>}
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto mb-4">
               <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-emerald-400">Success!</h3>
            <p className="text-emerald-500/80 mt-2 max-w-md mx-auto">
              We've processed your papers. 124 questions were extracted and mapped to 18 topics. 
              Your predictions and study plan have been updated.
            </p>
            <button 
              className="mt-6 px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all"
              onClick={() => window.location.href = "/dashboard"}
            >
              Go to Overview
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
