"use client";

import { motion } from "framer-motion";
import { AlertCircle, File, FileImage, Heart, UploadCloud } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatFileSize } from "../utils/clientHelpers";

const acceptedFiles = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"]
};

export default function FileDropzone({ error, isAnalyzing, onFileSelected, preview, selectedFile }) {
  const onDrop = useCallback(
    (accepted) => {
      const file = accepted[0];
      if (!file) return;

      // File upload flow: create a browser-only preview, then pass the file to the page for API upload.
      const nextPreview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;
      onFileSelected(file, nextPreview);
    },
    [onFileSelected]
  );

  const { getInputProps, getRootProps, isDragActive, fileRejections } = useDropzone({
    accept: acceptedFiles,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDrop
  });

  const rejectionMessage = fileRejections[0]?.errors[0]?.message;

  return (
    <div className="rounded-[2rem] border border-white/90 bg-white/82 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/78 sm:p-6">
      <motion.div
        {...getRootProps()}
        animate={isDragActive ? { scale: 1.02 } : { scale: 1 }}
        className="relative grid min-h-[330px] cursor-pointer place-items-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-pink-200 bg-gradient-to-br from-pink-50/90 via-white/80 to-emerald-50/90 p-8 text-center transition hover:border-pink-300 hover:from-pink-100/80 hover:to-sky-50 dark:border-slate-700 dark:from-slate-950/50 dark:via-slate-900/60 dark:to-slate-950/50 dark:hover:border-pink-400"
      >
        <span className="absolute left-5 top-5 h-8 w-8 rounded-full bg-mint/70" />
        <span className="absolute bottom-7 right-7 h-10 w-10 rotate-12 rounded-[1rem] bg-blush/70" />
        <Heart className="absolute right-9 top-8 h-5 w-5 text-pink-300" />
        <input {...getInputProps()} />
        <div className="relative">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] border border-white bg-white/95 shadow-soft dark:border-slate-800 dark:bg-slate-900"
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            <UploadCloud className="h-11 w-11 text-pink-500" />
          </motion.div>
          <h2 className="mt-6 text-2xl font-black">
            {isDragActive ? "Drop it gently here" : "Drag your file into this cozy spot"}
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            PDF, DOCX, TXT, PNG, JPG, JPEG, or PPTX up to 10 MB
          </p>
          <button
            className="mt-6 rounded-full bg-white px-5 py-3 font-semibold shadow-soft transition hover:-translate-y-1 hover:bg-pink-50 dark:bg-slate-800"
            disabled={isAnalyzing}
            type="button"
          >
            Choose file
          </button>
        </div>
      </motion.div>

      {(error || rejectionMessage) && (
        <div className="mt-4 flex gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error || rejectionMessage}</span>
        </div>
      )}

      {selectedFile && (
        <div className="mt-5 rounded-[1.5rem] border border-white bg-gradient-to-br from-cream to-pink-50 p-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white dark:bg-slate-900">
              {selectedFile.type.startsWith("image/") ? (
                <FileImage className="h-6 w-6 text-emerald-500" />
              ) : (
                <File className="h-6 w-6 text-blue-500" />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold">{selectedFile.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          {preview && (
            <img
              alt="Uploaded file preview"
              className="mt-4 h-48 w-full rounded-2xl object-cover"
              src={preview}
            />
          )}
        </div>
      )}
    </div>
  );
}
