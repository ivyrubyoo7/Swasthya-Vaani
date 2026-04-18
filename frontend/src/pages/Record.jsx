import { useRef } from 'react';
import { Mic, MicOff, Upload, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useRecorder } from '../hooks/useRecorder';

export default function Record() {
  const { recording, toggle, formatTime, uploadedFile, handleUpload } = useRecorder();
  const fileRef = useRef();

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-[22px] font-600 text-slate-900 dark:text-white">Record Consultation</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Tap the mic to start capturing clinical notes</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 py-6">

        {/* Mic button with rings */}
        <div className="relative flex items-center justify-center">
          {recording && (
            <>
              <span className="absolute inline-flex w-24 h-24 rounded-full bg-red-400 opacity-0 animate-pulse-ring" />
              <span className="absolute inline-flex w-24 h-24 rounded-full bg-red-400 opacity-0 animate-pulse-ring-delay" />
            </>
          )}
          <button
            onClick={toggle}
            className={`
              relative z-10 w-24 h-24 rounded-full flex items-center justify-center
              transition-all duration-200 focus:outline-none focus:ring-4
              ${recording
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-200 dark:focus:ring-red-900 shadow-lg shadow-red-200 dark:shadow-red-900/40'
                : 'bg-brand-600 hover:bg-brand-800 focus:ring-brand-100 dark:focus:ring-brand-900 shadow-card-hover'
              }
            `}
          >
            {recording
              ? <MicOff size={36} className="text-white" strokeWidth={1.8} />
              : <Mic    size={36} className="text-white" strokeWidth={1.8} />
            }
          </button>
        </div>

        {/* Wave bars */}
        <div className="flex items-center gap-1 h-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`wave-bar ${recording ? 'animate-wave' : ''}`}
              style={{ height: recording ? undefined : '6px' }}
            />
          ))}
        </div>

        {/* Label */}
        <div className="text-center">
          <p className={`font-medium text-[15px] ${recording ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
            {recording ? 'Recording…' : 'Tap to start recording'}
          </p>
          {recording && (
            <p className="text-sm font-mono font-600 text-red-400 mt-1">● {formatTime()}</p>
          )}
        </div>

        {/* Privacy note */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 dark:text-slate-500">
          <ShieldCheck size={13} strokeWidth={2} />
          Recording is processed locally. Your patient data stays private.
        </div>

        {/* Divider */}
        <div className="w-64 h-px bg-slate-100 dark:bg-slate-700" />

        {/* Upload zone */}
        {!uploadedFile ? (
          <button
            onClick={() => fileRef.current.click()}
            className="w-72 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 rounded-2xl p-6 flex flex-col items-center gap-2 transition-colors group"
          >
            <Upload size={22} className="text-brand-500 group-hover:scale-110 transition-transform" strokeWidth={1.8} />
            <p className="font-medium text-[13px] text-brand-600 dark:text-brand-400">Upload Audio File</p>
            <p className="text-[12px] text-slate-400 dark:text-slate-500">MP3, WAV, M4A · Click to browse</p>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-5 py-3">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
            <p className="text-[13px] font-medium text-emerald-700 dark:text-emerald-400">
              {uploadedFile}
            </p>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={e => handleUpload(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
