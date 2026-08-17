'use client';

import React from 'react';
import { Info, FolderArchive, ShieldAlert, Code2 } from 'lucide-react';

export function OfficialPackageNotice() {
  return (
    <div className="my-8 p-6 bg-slate-900/80 border border-cyan-500/30 rounded-2xl text-slate-300 font-mono text-xs space-y-4">
      <div className="flex items-center gap-3 text-cyan-400 font-bold">
        <FolderArchive size={20} />
        <span className="uppercase tracking-wider">Teleperformance Official Assets Integration Point</span>
      </div>

      <p className="text-slate-400 leading-relaxed font-sans text-xs sm:text-sm">
        This campaign landing page is structured with modular integration points. When the official 
        <code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded mx-1 font-mono">Deeqasa html.zip</code> 
        package is provided by Teleperformance, extract its contents to:
      </p>

      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-cyan-400 overflow-x-auto text-[11px]">
        /public/campaigns/hp-intel-spark/official-assets/
      </div>

      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-[11px] text-amber-200 font-sans">
        <div className="flex items-center gap-2 font-bold font-mono text-amber-400">
          <ShieldAlert size={16} />
          <span>INSPECTION CHECKLIST BEFORE SWAPPING HTML:</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
          <li>Inspect HTML/CSS/JS for duplicate GA4 script tags or third-party tracking snippets.</li>
          <li>Ensure lead forms map to our validated lead API endpoint (<code className="text-cyan-300">/api/hp-intel-spark/lead</code>).</li>
          <li>Verify asset paths for images, CSS files, and web fonts.</li>
          <li>Confirm zero external malicious redirects or unwanted inline script execution.</li>
        </ul>
      </div>
    </div>
  );
}
