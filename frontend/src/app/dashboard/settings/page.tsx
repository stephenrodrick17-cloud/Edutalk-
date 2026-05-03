"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Shield, Palette, Globe, Save, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSections = [
  {
    title: "Profile Information",
    icon: User,
    description: "Update your personal details and public profile.",
    fields: [
      { label: "Full Name", type: "text", value: "Alex Johnson" },
      { label: "Email Address", type: "email", value: "alex.j@example.com" },
      { label: "University", type: "text", value: "Tech University of Science" },
    ]
  },
  {
    title: "Notifications",
    icon: Bell,
    description: "Manage how you receive alerts and study reminders.",
    fields: [
      { label: "Study Reminders", type: "toggle", value: true },
      { label: "New Paper Analysis", type: "toggle", value: true },
      { label: "Weekly Progress Report", type: "toggle", value: false },
    ]
  },
  {
    title: "Security",
    icon: Shield,
    description: "Protect your account and data privacy.",
    fields: [
      { label: "Two-Factor Authentication", type: "toggle", value: false },
      { label: "Change Password", type: "button", value: "Update" },
    ]
  }
];

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 1000);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-400">Manage your account preferences and application settings.</p>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-500 backdrop-blur-xl"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-bold">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {settingsSections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-3xl border border-white/5 bg-white/5 p-8"
          >
            <div className="flex items-center gap-4 mb-8">
               <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                  <section.icon className="h-6 w-6" />
               </div>
               <div>
                  <h3 className="text-xl font-bold">{section.title}</h3>
                  <p className="text-sm text-slate-500">{section.description}</p>
               </div>
            </div>

            <div className="space-y-6">
               {section.fields.map((field, j) => (
                 <div key={j} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-white/5 last:border-none">
                    <label className="text-sm font-medium text-slate-300">{field.label}</label>
                    <div className="w-full md:w-2/3">
                       {field.type === "toggle" ? (
                         <button className={cn(
                           "relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none",
                           field.value ? "bg-blue-600" : "bg-white/10"
                         )}>
                           <span className={cn(
                             "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                             field.value ? "translate-x-6" : "translate-x-1"
                           )} />
                         </button>
                       ) : field.type === "button" ? (
                         <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all">
                            {field.value}
                         </button>
                       ) : (
                         <input 
                           type={field.type} 
                           defaultValue={field.value as string}
                           className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-blue-500/50 transition-all"
                         />
                       )}
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
         <button 
           onClick={() => window.location.reload()}
           className="px-8 py-3 rounded-2xl border border-white/10 bg-white/5 font-bold text-sm hover:bg-white/10 transition-all"
         >
            Cancel
         </button>
         <button 
           onClick={handleSave}
           disabled={isSaving}
           className="px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
         >
            {isSaving ? "Saving..." : <><Save className="h-4 w-4" /> Save Changes</>}
         </button>
      </div>
    </div>
  );
}
