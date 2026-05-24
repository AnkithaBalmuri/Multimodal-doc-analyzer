import "./globals.css";

export const metadata = {
  title: "AI Multimodal Document Analyzer",
  description: "A cute beginner-friendly app for analyzing PDFs, DOCX, TXT files, and images with AI."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
