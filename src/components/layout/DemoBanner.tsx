import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-blue-900/50 shadow-sm">
      <div className="flex items-center gap-2.5 mx-auto">
        <span className="inline-flex items-center gap-1 font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
          <ShieldAlert className="w-3 h-3 text-amber-400" />
          DEMO ENVIRONMENT
        </span>
        <span className="text-slate-300 hidden sm:inline">
          Educational simulation for L&T: Open Banking Consent & Secure Data Sharing. Dummy Indian banking data only.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
