import { NextResponse } from "next/server";
import { traceable } from "langsmith/traceable";
import {
  extractTextFromFile,
  getFileTypeLabel,
  isImageFile,
  isSupportedFile
} from "../../../utils/server/fileExtractors";
import { analyzeWithGroq } from "../../../utils/server/groqAnalyzer";
import { getTextStats, truncateForModel } from "../../../utils/server/textStats";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Please upload a file first." }, { status: 400 });
    }

    if (!isSupportedFile(file.name)) {
      return NextResponse.json(
        { error: "Unsupported file type. Try PDF, DOCX, TXT, PNG, JPG, JPEG, or PPTX." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "That file is too large. Please upload a file under 10 MB." },
        { status: 400 }
      );
    }

    const fileTypeLabel = getFileTypeLabel(file.name);
    const hasImage = isImageFile(file.name);

    const analyzeUploadedFile = traceable(async function analyzeUploadedFile(traceInput) {
      // Temporary file handling: the file becomes a Buffer in memory and is never written to disk.
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const extractedText = (await extractTextFromFile(file, buffer)).trim();

      if (!hasImage && extractedText.length < 10) {
        throw new Error("I could not find readable text in this document. Try a clearer file.");
      }

      const stats = getTextStats(extractedText);
      const imageDataUrl = hasImage
        ? `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`
        : null;

      const aiResult = await analyzeWithGroq({
        extractedText: truncateForModel(extractedText),
        fileName: file.name,
        fileTypeLabel,
        imageDataUrl
      });

      return {
        fileName: file.name,
        fileTypeLabel,
        wordCount: stats.wordCount,
        readingTime: stats.readingTime,
        extractedTextPreview: extractedText.slice(0, 1200),
        ...aiResult
      };
    }, {
      name: "Analyze uploaded document",
      run_type: "chain",
      metadata: {
        app: "AI Multimodal Document Analyzer",
        project: process.env.LANGSMITH_PROJECT || "Multimodal-doc-analyzer"
      },
      tags: ["document-upload", "nextjs-api"]
    });

    const result = await analyzeUploadedFile({
      fileName: file.name,
      fileSize: file.size,
      fileTypeLabel,
      hasImage
    });

    // Deployment logic: return JSON only. Vercel serverless functions stay stateless and database-free.
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong while analyzing the file." },
      { status: 500 }
    );
  }
}
