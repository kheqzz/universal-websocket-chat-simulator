import React from 'react';

interface AppLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  inspector: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ sidebar, main, inspector }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 min-w-[200px] max-w-[320px] border-r border-slate-700 flex flex-col bg-slate-800/50">
        {sidebar}
      </aside>
      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {main}
      </main>
      {/* Inspector */}
      <aside className="w-96 min-w-[280px] max-w-[480px] border-l border-slate-700 flex flex-col bg-slate-800/50">
        {inspector}
      </aside>
    </div>
  );
};