export function getTextStats(text = "") {
  const words = text.trim().match(/\S+/g) || [];
  const wordCount = words.length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    wordCount,
    readingTime: `${minutes} min read`
  };
}

export function truncateForModel(text = "", maxCharacters = 18000) {
  if (text.length <= maxCharacters) return text;
  return `${text.slice(0, maxCharacters)}\n\n[Text was shortened so the beginner demo stays lightweight.]`;
}
