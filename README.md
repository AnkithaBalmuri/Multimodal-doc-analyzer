# AI Multimodal Document Analyzer

A beginner-friendly Next.js 14 web app that analyzes PDFs, DOCX files, TXT files, images, and PPTX presentations with AI.

The app does **not** use a database. Uploaded files are processed temporarily in memory by a Next.js API route and are not stored permanently.

## Features

- Cute pastel landing page with responsive design
- Drag and drop upload area
- File preview for images
- PDF, DOCX, TXT, PNG, JPG, JPEG, and PPTX support
- OCR for image text extraction with `tesseract.js`
- Groq AI-powered short summary, detailed summary, key points, and topics
- LangSmith tracing for upload and AI analysis runs
- Image description for image uploads
- Word count and reading time estimate
- Copy summary button
- Download summary as `.txt`
- Dark mode toggle
- Beginner-friendly comments in the code
- Vercel-compatible API route

## Folder Structure

```txt
ai-multimodal-document-analyzer/
|-- app/
|   |-- api/
|   |   `-- analyze/
|   |       `-- route.js
|   |-- globals.css
|   |-- layout.js
|   `-- page.js
|-- components/
|   |-- AnalysisResults.jsx
|   |-- DoodleIllustration.jsx
|   |-- FileDropzone.jsx
|   |-- LoadingAnimation.jsx
|   `-- ThemeToggle.jsx
|-- utils/
|   |-- clientHelpers.js
|   `-- server/
|       |-- fileExtractors.js
|       |-- groqAnalyzer.js
|       `-- textStats.js
|-- .env.local.example
|-- package.json
|-- tailwind.config.js
|-- postcss.config.mjs
|-- next.config.mjs
`-- README.md
```

## How It Works

1. The user uploads a file in the browser.
2. The frontend sends the file to `/api/analyze` using `FormData`.
3. The API route converts the uploaded file into an in-memory `Buffer`.
4. Text is extracted using:
   - `pdf-parse` for PDFs
   - `mammoth` for DOCX files
   - built-in text reading for TXT files
   - `tesseract.js` for image OCR
   - `jszip` for simple PPTX slide text extraction
5. LangSmith records a trace for the upload pipeline and Groq model call.
6. The extracted text is sent to Groq for analysis.
7. The API returns clean JSON cards to the frontend.
8. Nothing is saved to a database or permanent file storage.

## Install

```bash
npm install
```

## Add Your API Key

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Then add your Groq and LangSmith API keys:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=your_langsmith_api_key_here
LANGSMITH_PROJECT=Multimodal-doc-analyzer
LANGCHAIN_CALLBACKS_BACKGROUND=false
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

You can change `GROQ_MODEL` to another Groq model that supports your file flow. For image uploads, use a Groq model that supports vision.

## Run Locally

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Build Check

```bash
npm run build
```

## Deploy on Vercel

1. Push this project to GitHub.
2. Go to [Vercel](https://vercel.com).
3. Click **Add New Project**.
4. Import your GitHub repository.
5. Add these environment variables in Vercel:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=your_langsmith_api_key_here
LANGSMITH_PROJECT=Multimodal-doc-analyzer
LANGCHAIN_CALLBACKS_BACKGROUND=false
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

6. Click **Deploy**.

## GitHub Push Commands

```bash
git init
git add .
git commit -m "Build AI multimodal document analyzer"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

## Beginner Notes

- No database is needed.
- No login system is included.
- Files are not stored permanently.
- Keep uploads small for faster serverless processing.
- OCR can take longer than normal text extraction, especially on large images.
- PPTX support is intentionally simple and extracts visible slide text only.

## Important Files to Study

- `app/page.js`: main landing page and upload state
- `components/FileDropzone.jsx`: drag and drop upload flow
- `app/api/analyze/route.js`: backend API route
- `utils/server/fileExtractors.js`: document text extraction
- `utils/server/groqAnalyzer.js`: Groq API call with LangSmith tracing


