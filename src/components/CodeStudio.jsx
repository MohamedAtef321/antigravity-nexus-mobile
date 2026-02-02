import React from 'react';
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from '@codesandbox/sandpack-react';
import { useSandpack } from '@codesandbox/sandpack-react';

const CustomPreview = () => {
    // Force preview to show
    const { sandpack } = useSandpack();
    // You can add refresh buttons here
    return (
        <SandpackPreview 
            style={{ height: '100%' }} 
            showOpenInCodeSandbox={false} 
            showRefreshButton={true}
        />
    );
}

export default function CodeStudio({ files, setFiles }) {
  return (
    <div className="h-full flex flex-col">
      <SandpackProvider 
        template="react" 
        theme="dark" 
        files={files}
        options={{
            visibleFiles: ['/App.js'],
            activeFile: '/App.js',
            classes: {
                "sp-wrapper": "h-full",
                "sp-layout": "h-full flex-col", // Force column layout for mobile
                "sp-stack": "h-full"
            }
        }}
      >
        <SandpackLayout className="flex-1 flex flex-col h-full">
            {/* Split view or Toggle? For mobile, maybe tabs inside tabs? 
                Let's do 50/50 vertical split for now, or Tabs.
                Sandpack handles responsive layout automatically usually, but we want control.
            */}
             <div className="h-1/2 border-b border-gray-700">
                <SandpackPreview style={{ height: '100%' }} showNavigator={false} />
             </div>
             <div className="h-1/2">
                <SandpackCodeEditor 
                    showTabs 
                    showLineNumbers 
                    showInlineErrors 
                    wrapContent 
                    style={{ height: '100%' }}
                />
             </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
