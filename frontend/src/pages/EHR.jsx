import { FileText, Plug } from 'lucide-react';

export default function EHR() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-[22px] font-600 text-slate-900 dark:text-white">EHR Data</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Electronic Health Records · Connect your hospital system</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card">
        <div className="flex flex-col items-center justify-center py-20 gap-5 opacity-60">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
            <FileText size={28} className="text-slate-400 dark:text-slate-500" strokeWidth={1.4} />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-[15px] text-slate-600 dark:text-slate-300 mb-1">No EHR data yet</h3>
            <p className="text-[13px] text-slate-400 dark:text-slate-500 max-w-56 leading-relaxed">
              Connect your hospital's EHR system to view and manage patient records here.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-[13px] font-medium hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
            <Plug size={14} strokeWidth={2} />
            Connect EHR System
          </button>
        </div>
      </div>
    </div>
  );
}
