"use client";

import { type ReactNode } from "react";

interface TabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  children: ReactNode;
}

export function Tabs({ tabs, active, onChange, children }: TabsProps) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto border-b border-white/10 pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`shrink-0 rounded-t-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 sm:py-2.5 ${
              active === tab.id
                ? "bg-gold/10 text-gold border-b-2 border-gold -mb-[2px]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
