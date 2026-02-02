import React from 'react';
import { MessageSquare, Code2, Settings } from 'lucide-react';
import clsx from 'clsx';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'code', icon: Code2, label: 'Studio' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="h-16 bg-gray-950 border-t border-gray-800 flex items-center justify-around px-2 pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              isActive ? "text-blue-500" : "text-gray-500 hover:text-gray-300"
            )}
          >
            <Icon size={24} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
