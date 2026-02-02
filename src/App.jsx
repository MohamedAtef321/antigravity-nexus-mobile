import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ChatInterface from './components/ChatInterface';
import CodeStudio from './components/CodeStudio';
import { Bot, Code2, Settings } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'code', 'settings'
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  
  const [files, setFiles] = useState({
    "/App.js": {
      code: `import React from "react";\n\nexport default function App() {\n  return (\n    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4", padding: "20px" }}>\n      <h1>Hello Antigravity</h1>\n      <p>Start building your mobile app here.</p>\n    </div>\n  );\n}`
    }
  });

  const handleApiKeySave = (key) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      {/* Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'chat' && (
          <ChatInterface 
            apiKey={apiKey} 
            onCodeGenerated={(newFiles) => {
              setFiles(newFiles);
              setActiveTab('code');
            }}
          />
        )}
        
        {activeTab === 'code' && (
          <CodeStudio files={files} setFiles={setFiles} />
        )}

        {activeTab === 'settings' && (
           <div className="p-6 space-y-4">
             <h2 className="text-xl font-bold">Settings</h2>
             <div className="space-y-2">
               <label className="block text-sm text-gray-400">Gemini API Key</label>
               <input 
                 type="password" 
                 value={apiKey}
                 onChange={(e) => handleApiKeySave(e.target.value)}
                 className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                 placeholder="Enter your API Key"
               />
               <p className="text-xs text-gray-500">
                 Key is stored locally on your device.
               </p>
             </div>
           </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
