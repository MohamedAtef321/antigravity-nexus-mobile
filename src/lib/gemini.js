import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are Antigravity, an expert React Native/Web Developer.
Your goal is to help the user build a React application.
The user's code runs in a Sandpack environment (Vite template).

Output Rules:
1. You can explain your plan in text.
2. When you write code, you MUST provide the FULL content of the file.
3. Wrap code in standard markdown code blocks, e.g. \`\`\`jsx ... \`\`\`.
4. For this version, you primarily edit '/App.js'. If you need to create components, you can try, but sticking to a single file or a few files is safer for the mobile preview.
5. ALWAYS START your code block with a comment indicating the file path, e.g. // /App.js

Example Response:
"Sure, here is a counter app."
\`\`\`jsx
// /App.js
import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c+1)}>{count}</button>;
}
\`\`\`
`;

export async function sendMessageToGemini(apiKey, history, newMessage) {
  if (!apiKey) throw new Error("API Key is missing");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am Antigravity. I will generate React code for Sandpack." }],
      },
      ...history
    ],
  });

  const result = await chat.sendMessage(newMessage);
  const response = result.response;
  return response.text();
}
