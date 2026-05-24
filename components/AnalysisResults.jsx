"use client";

import { BookOpen, Clipboard, Download, Hash, Timer } from "lucide-react";
import { copyText, downloadTextFile } from "../utils/clientHelpers";

export default function AnalysisResults({ analysis }) {
  const downloadableSummary = [
    `File: ${analysis.fileName}`,
    `Word count: ${analysis.wordCount}`,
    `Reading time: ${analysis.readingTime}`,
    "",
    "Short summary:",
    analysis.shortSummary,
    "",
    "Detailed summary:",
    analysis.detailedSummary,
    "",
    "Key points:",
    ...analysis.keyPoints.map((point) => `- ${point}`),
    "",
    "Topics:",
    ...analysis.topics.map((topic) => `- ${topic}`)
  ].join("\n");

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-pink-500">Analysis complete</p>
          <h2 className="mt-1 text-2xl font-black">{analysis.fileName}</h2>
        </div>
        <div className="flex gap-2">
          <button
            className="grid h-11 w-11 place-items-center rounded-full bg-pink-50 shadow-sm transition hover:-translate-y-1 dark:bg-slate-800"
            onClick={() => copyText(downloadableSummary)}
            title="Copy summary"
            type="button"
          >
            <Clipboard className="h-5 w-5" />
          </button>
          <button
            className="grid h-11 w-11 place-items-center rounded-full bg-emerald-50 shadow-sm transition hover:-translate-y-1 dark:bg-slate-800"
            onClick={() => downloadTextFile("document-summary.txt", downloadableSummary)}
            title="Download summary as TXT"
            type="button"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={Hash} label="Words" value={analysis.wordCount} />
        <StatCard icon={Timer} label="Reading time" value={analysis.readingTime} />
        <StatCard icon={BookOpen} label="File type" value={analysis.fileTypeLabel} />
      </div>

      <ResultCard title="Short Summary">
        <p>{analysis.shortSummary}</p>
      </ResultCard>

      <ResultCard title="Detailed Summary">
        <p>{analysis.detailedSummary}</p>
      </ResultCard>

      <ResultCard title="Key Points">
        <ul className="space-y-2">
          {analysis.keyPoints.map((point) => (
            <li className="rounded-2xl border border-white bg-gradient-to-r from-cream to-pink-50 p-3 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900" key={point}>
              {point}
            </li>
          ))}
        </ul>
      </ResultCard>

      <ResultCard title="Important Topics">
        <div className="flex flex-wrap gap-2">
          {analysis.topics.map((topic) => (
            <span
              className="rounded-full bg-mint px-3 py-2 text-sm font-semibold text-slate-900"
              key={topic}
            >
              {topic}
            </span>
          ))}
        </div>
      </ResultCard>

      {analysis.imageDescription && (
        <ResultCard title="Image Description">
          <p>{analysis.imageDescription}</p>
        </ResultCard>
      )}

      {analysis.extractedTextPreview && (
        <ResultCard title="Extracted Text Preview">
          <p className="max-h-44 overflow-auto whitespace-pre-wrap text-sm">
            {analysis.extractedTextPreview}
          </p>
        </ResultCard>
      )}
    </div>
  );
}

function ResultCard({ children, title }) {
  return (
    <section className="rounded-[1.25rem] border border-pink-50 bg-white/92 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h3 className="mb-3 text-lg font-black">{title}</h3>
      <div className="leading-7 text-slate-700 dark:text-slate-300">{children}</div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-white bg-gradient-to-br from-cream to-sky-50 p-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
      <Icon className="h-5 w-5 text-pink-500" />
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}
