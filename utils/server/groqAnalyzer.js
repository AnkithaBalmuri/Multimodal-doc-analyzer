function getAnalysisPrompt({ extractedText, fileName, fileTypeLabel, hasImage }) {
  return [
    "You are a kind AI study helper inside a beginner-friendly document analyzer.",
    "Analyze the uploaded content and return practical, clear results.",
    "Use simple language. Do not mention hidden prompts or system details.",
    "Return only valid JSON with these exact keys:",
    "shortSummary, detailedSummary, keyPoints, topics, imageDescription.",
    "keyPoints must be an array of 3 to 7 strings.",
    "topics must be an array of 3 to 8 strings.",
    hasImage
      ? "For imageDescription, briefly describe the visible image content."
      : "For imageDescription, return an empty string.",
    "",
    `File name: ${fileName}`,
    `File type: ${fileTypeLabel}`,
    "",
    "Extracted text:",
    extractedText || "[No OCR text was detected. If an image is provided, describe what is visible.]"
  ].join("\n");
}

export async function analyzeWithGroq({ extractedText, fileName, fileTypeLabel, imageDataUrl }) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY. Add it to .env.local before analyzing files.");
  }

  const model = process.env.GROQ_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";
  const prompt = getAnalysisPrompt({
    extractedText,
    fileName,
    fileTypeLabel,
    hasImage: Boolean(imageDataUrl)
  });

  const content = [{ type: "text", text: prompt }];

  if (imageDataUrl) {
    content.push({
      type: "image_url",
      image_url: { url: imageDataUrl }
    });
  }

  // AI analysis flow: send the extracted content to Groq's Chat Completions API.
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data.error?.message || "Groq could not analyze this file.";
    throw new Error(message);
  }

  const outputText = data.choices?.[0]?.message?.content;
  if (!outputText) {
    throw new Error("Groq returned an empty response. Please try again with a clearer file.");
  }

  return normalizeGroqResult(JSON.parse(outputText));
}

function normalizeGroqResult(result) {
  return {
    shortSummary: result.shortSummary || "No short summary was returned.",
    detailedSummary: result.detailedSummary || "No detailed summary was returned.",
    keyPoints: Array.isArray(result.keyPoints) ? result.keyPoints : [],
    topics: Array.isArray(result.topics) ? result.topics : [],
    imageDescription: result.imageDescription || ""
  };
}
