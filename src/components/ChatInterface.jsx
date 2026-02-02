import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendMessageToGemini } from '../lib/gemini';

export default function ChatInterface({ apiKey, onCodeGenerated }) {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am Antigravity. I can help you build React apps right here on your phone. What shall we build?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const extractCode = (text) => {
    // Simple regex to find code blocks. 
    // We look for ```jsx ... ``` or similar.
    const codeBlockRegex = /```(?:jsx|js|javascript)?\s*([\s\S]*?)```/g;
    let match;
    const newFiles = {};
    let found = false;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const code = match[1];
      // Try to find file path comment
      const pathMatch = code.match(/\/\/\s*(\/[\w\d\.\-_]+)/);
      const filePath = pathMatch ? pathMatch[1] : '/App.js'; // Default to App.js
      
      newFiles[filePath] = { code: code };
      found = true;
    }

    if (found) {
      return newFiles;
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      alert('Please set your API Key in Settings first.');
      return;
    }

    const userText = input.trim();
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // transform messages to Gemini history format if needed, but our helper takes history separately.
      // We'll keep a separate history state for the API.
      const responseText = await sendMessageToGemini(apiKey, history, userText);
      
      const botMsg = { role: 'model', text: responseText };
      setMessages(prev => [...prev, botMsg]);
      setHistory(prev => [
        ...prev, 
        { role: 'user', parts: [{ text: userText }] },
        { role: 'model', parts: [{ text: responseText }] }
      ]);

      // Check for code
      const generatedFiles = extractCode(responseText);
      if (generatedFiles) {
        onCodeGenerated(generatedFiles);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-200 rounded-bl-none prose prose-invert max-w-none'
              }`}
            >
              {msg.role === 'user' ? (
                <p>{msg.text}</p>
              ) : (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center text-gray-500 text-xs ml-4 space-x-2">
            <Loader2 className="animate-spin" size={12} />
            <span>Generating...</span>
          </div>
        )}
      </div>

      <div className="p-3 bg-gray-950 border-t border-gray-800">
        <div className="flex items-center space-x-2 bg-gray-900 rounded-full px-4 py-2 border border-gray-700">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2 bg-blue-600 rounded-full text-white disabled:opacity-50 disabled:bg-gray-700"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
