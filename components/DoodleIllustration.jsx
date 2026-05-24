"use client";

import { motion } from "framer-motion";
import { Bot, FileHeart, FileText, Heart, Sparkles, Stars } from "lucide-react";

export default function DoodleIllustration() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      className="relative mx-auto h-[380px] w-full max-w-[500px]"
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute left-4 top-7 h-64 w-52 rotate-[-6deg] rounded-[2rem] border border-pink-100 bg-white/92 p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <FileText className="h-9 w-9 text-blue-400" />
          <Heart className="h-6 w-6 text-pink-400" />
        </div>
        <div className="mt-8 space-y-3">
          <span className="block h-3 rounded-full bg-blush/80" />
          <span className="block h-3 w-4/5 rounded-full bg-mint/90" />
          <span className="block h-3 w-3/5 rounded-full bg-skysoft/90" />
        </div>
        <div className="mt-8 rounded-2xl border border-violet-100 bg-lilac/70 p-4 text-sm font-bold text-violet-900">
          gentle summary
        </div>
      </div>
      <div className="absolute right-3 top-28 h-56 w-56 rotate-[6deg] rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-pink-50 to-emerald-50 p-5 shadow-soft dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
        <div className="grid h-16 w-16 place-items-center rounded-[1.5rem] bg-white shadow-sm dark:bg-slate-900">
          <Bot className="h-11 w-11 text-pink-500" />
        </div>
        <div className="mt-5 rounded-2xl bg-white/90 p-4 text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-100">
          I found the important bits.
        </div>
        <FileHeart className="absolute bottom-6 right-6 h-10 w-10 text-emerald-500" />
      </div>
      <div className="absolute bottom-12 left-24 h-16 w-16 rotate-12 rounded-[1.25rem] border border-blue-100 bg-skysoft/70 shadow-soft" />
      <div className="absolute bottom-4 right-28 h-12 w-12 -rotate-12 rounded-full border border-pink-100 bg-blush/70 shadow-soft" />
      <Sparkles className="absolute right-10 top-6 h-8 w-8 text-amber-300" />
      <Stars className="absolute bottom-20 left-2 h-8 w-8 text-violet-300" />
    </motion.div>
  );
}
