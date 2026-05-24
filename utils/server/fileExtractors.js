import JSZip from "jszip";
import mammoth from "mammoth";
import { createWorker } from "tesseract.js";

const supportedTypes = {
  ".pdf": "PDF document",
  ".docx": "Word document",
  ".txt": "Text file",
  ".png": "PNG image",
  ".jpg": "JPEG image",
  ".jpeg": "JPEG image",
  ".pptx": "PowerPoint presentation"
};

export function getFileExtension(fileName = "") {
  const lastDot = fileName.lastIndexOf(".");
  return lastDot === -1 ? "" : fileName.slice(lastDot).toLowerCase();
}

export function isSupportedFile(fileName = "") {
  return Boolean(supportedTypes[getFileExtension(fileName)]);
}

export function getFileTypeLabel(fileName = "") {
  return supportedTypes[getFileExtension(fileName)] || "Unsupported file";
}

export function isImageFile(fileName = "") {
  return [".png", ".jpg", ".jpeg"].includes(getFileExtension(fileName));
}

export async function extractTextFromFile(file, buffer) {
  const extension = getFileExtension(file.name);

  // File upload flow: each branch reads the in-memory Buffer and returns plain text.
  if (extension === ".pdf") return extractPdfText(buffer);
  if (extension === ".docx") return extractDocxText(buffer);
  if (extension === ".txt") return buffer.toString("utf-8");
  if (extension === ".pptx") return extractPptxText(buffer);
  if (isImageFile(file.name)) return extractImageText(buffer);

  throw new Error("Unsupported file type. Please upload PDF, DOCX, TXT, PNG, JPG, JPEG, or PPTX.");
}

async function extractPdfText(buffer) {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text || "";
}

async function extractDocxText(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

async function extractImageText(buffer) {
  const worker = await createWorker("eng");
  try {
    const result = await worker.recognize(buffer);
    return result.data.text || "";
  } finally {
    await worker.terminate();
  }
}

async function extractPptxText(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const slides = await Promise.all(
    slideFiles.map(async (name, index) => {
      const xml = await zip.files[name].async("string");
      const textRuns = [...xml.matchAll(/<a:t>(.*?)<\/a:t>/g)].map((match) =>
        decodeXml(match[1])
      );
      return `Slide ${index + 1}:\n${textRuns.join(" ")}`;
    })
  );

  return slides.join("\n\n");
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}
