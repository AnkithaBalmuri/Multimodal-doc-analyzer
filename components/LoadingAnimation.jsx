"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LoadingAnimation() {
  return (
    <div className="grid h-full min-h-[380px] place-items-center text-center">
      <div>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.08, 1] }}
          className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-lilac shadow-soft"
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-11 w-11 text-violet-700" />
        </motion.div>
        <h2 className="mt-6 text-2xl font-black">Analyzing your file</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Extracting text, reading the content, and making friendly cards.
        </p>
        <div className="mx-auto mt-6 flex max-w-xs gap-2">
          {[0, 1, 2].map((item) => (
            <motion.span
              animate={{ opacity: [0.35, 1, 0.35] }}
              className="h-3 flex-1 rounded-full bg-pink-300"
              key={item}
              transition={{ delay: item * 0.2, duration: 1, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
