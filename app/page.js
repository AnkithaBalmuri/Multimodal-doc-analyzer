"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  CheckCircle2,
  FileText,
  Heart,
  ImageIcon,
  Leaf,
  Sparkles,
  Wand2
} from "lucide-react";
import AnalysisResults from "../components/AnalysisResults";
import DoodleIllustration from "../components/DoodleIllustration";
import FileDropzone from "../components/FileDropzone";
import LoadingAnimation from "../components/LoadingAnimation";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const workflow = useMemo(
    () => [
      "Drop your file",
      "Text is extracted in memory",
      "AI creates a friendly analysis",
      "Copy or download the summary"
    ],
    []
  );

  async function handleAnalyze(file) {
    setError("");
    setAnalysis(null);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // API call: the browser sends the uploaded file to our temporary Next.js API route.
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong while analyzing the file.");
      }

      setAnalysis(data);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleFileSelected(file, nextPreview) {
    setSelectedFile(file);
    setPreview(nextPreview);
    handleAnalyze(file);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdf8] text-ink transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <section className="relative isolate px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(255,218,232,.58)_0,transparent_27%),radial-gradient(circle_at_82%_18%,rgba(203,245,225,.60)_0,transparent_25%),radial-gradient(circle_at_62%_72%,rgba(205,231,255,.54)_0,transparent_30%),linear-gradient(135deg,#fffdf8_0%,#f7fbff_46%,#fff8fc_100%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(255,217,232,.18)_0,transparent_30%),radial-gradient(circle_at_85%_25%,rgba(200,247,225,.14)_0,transparent_24%),linear-gradient(135deg,#0f172a_0%,#172033_55%,#211827_100%)]" />
        <div className="pointer-events-none absolute left-8 top-28 hidden h-12 w-12 rotate-12 rounded-[1.25rem] border border-pink-100 bg-white/60 shadow-soft md:block" />
        <div className="pointer-events-none absolute right-16 top-40 hidden h-10 w-10 -rotate-6 rounded-full border border-emerald-100 bg-mint/50 shadow-soft lg:block" />
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/65 px-3 py-2 font-semibold shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-pink-100 dark:bg-slate-800">
              <Sparkles className="h-5 w-5 text-pink-500" />
            </span>
            DocuBuddy AI
          </div>
          <ThemeToggle />
        </nav>

        <div className="mx-auto grid max-w-6xl items-center gap-10 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/75">
              <Leaf className="h-4 w-4 text-emerald-500" />
              Calm, private, database-free document help
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-normal sm:text-6xl">
              AI Multimodal Document Analyzer
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
              A soft little workspace for turning documents and images into summaries,
              key points, topics, reading stats, and gentle AI explanations.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              {["PDF", "DOCX", "TXT", "Images", "PPTX"].map((item) => (
                <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm dark:bg-slate-900" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <a
              href="#upload"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f78fb3] px-6 py-3 font-semibold text-white shadow-soft transition hover:-translate-y-1 hover:bg-[#ee7da7] focus:outline-none focus:ring-4 focus:ring-pink-200 dark:bg-white dark:text-slate-950"
            >
              <Wand2 className="h-5 w-5" />
              Start analyzing
            </a>
          </motion.div>

          <DoodleIllustration />
        </div>
      </section>

      <section id="upload" className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <FileDropzone
            error={error}
            isAnalyzing={isAnalyzing}
            onFileSelected={handleFileSelected}
            preview={preview}
            selectedFile={selectedFile}
          />

          <div className="min-h-[430px] rounded-[2rem] border border-white/90 bg-white/82 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/78 sm:p-6">
            {isAnalyzing ? (
              <LoadingAnimation />
            ) : analysis ? (
              <AnalysisResults analysis={analysis} />
            ) : (
              <div className="grid h-full place-items-center rounded-[1.5rem] border border-dashed border-pink-100 bg-gradient-to-br from-white/75 via-pink-50/60 to-emerald-50/60 p-8 text-center dark:border-slate-700 dark:from-slate-950/40 dark:via-slate-950/30 dark:to-slate-900/30">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-[1.4rem] bg-skysoft shadow-sm dark:bg-slate-800">
                    <Heart className="h-8 w-8 text-pink-500" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold">Your cozy summary will appear here</h2>
                  <p className="mt-3 max-w-md text-slate-600 dark:text-slate-300">
                    Upload a small file and the app will read it, analyze it, and keep the results tidy.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-black">Sweet little features</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Smart summaries", "Short and detailed summaries in clean cards.", Sparkles],
              ["OCR for images", "Visible text extraction plus image-aware analysis.", ImageIcon],
              ["No database", "Files are processed temporarily in memory only.", CheckCircle2]
            ].map(([title, text, Icon]) => (
              <motion.div
                className="rounded-[1.5rem] border border-white/80 bg-white/82 p-6 shadow-soft transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900"
                key={title}
                whileHover={{ rotate: -1 }}
              >
                <Icon className="h-7 w-7 text-pink-500" />
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-3xl font-black">Tiny peaceful workflow</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {workflow.map((step, index) => (
              <div className="rounded-2xl border border-white bg-gradient-to-br from-cream to-pink-50 p-5 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900" key={step}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-mint font-bold text-slate-900 shadow-sm">
                  {index + 1}
                </span>
                <p className="mt-4 font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-4 py-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Built for learning: Next.js API routes, Tailwind CSS, temporary in-memory processing, and Vercel deployment.
      </footer>
    </main>
  );
}
