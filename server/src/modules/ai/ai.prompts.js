export const summarizePrompt = (content) => `
Summarize the following AI article in simple Hindi.

Content:
${content}

Return a concise summary suitable for beginners.
`;

export const tagPrompt = (title, content) => `
Generate 5 SEO-friendly tags for this AI article.

Title:
${title}

Content:
${content}

Return only a JSON array.
`;

export const explainPrompt = (topic) => `
Explain the following AI concept in simple Hindi for beginners:

Topic:
${topic}
`;

export const chatbotPrompt = (message) => `
You are an AI tutor helping students learn artificial intelligence.

Answer clearly and simply.

Question:
${message}
`;