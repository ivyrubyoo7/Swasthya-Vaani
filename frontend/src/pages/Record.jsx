import { useRef, useState } from 'react';
import { Mic, MicOff, Upload, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useRecorder } from '../hooks/useRecorder';

export default function Record() {
  const {
    recording,
    toggle,
    formatTime,
    uploadedFile,
    handleUpload,
    transcript,
    analysis,
    handleTextInput
  } = useRecorder();

  const fileRef = useRef();

  const [showTranscript, setShowTranscript] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [inputText, setInputText] = useState("");

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-[22px] font-600 text-slate-900 dark:text-white">
          Record Consultation
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Tap the mic to start capturing clinical notes
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 py-6">

        {/* 🎤 MIC */}
        <div className="relative flex items-center justify-center">
          {recording && (
            <>
              <span className="absolute inline-flex w-24 h-24 rounded-full bg-red-400 opacity-0 animate-pulse-ring" />
              <span className="absolute inline-flex w-24 h-24 rounded-full bg-red-400 opacity-0 animate-pulse-ring-delay" />
            </>
          )}
          <button onClick={toggle}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center
              ${recording ? 'bg-red-500' : 'bg-brand-600'}`}
          >
            {recording
              ? <MicOff size={36} className="text-white" />
              : <Mic size={36} className="text-white" />
            }
          </button>
        </div>

        {/* ⏱️ TIMER */}
        {recording && (
          <p className="text-sm text-red-400">● {formatTime()}</p>
        )}

        {/* 🔒 Privacy */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={13} />
          Your data stays private
        </div>

        {/* 📁 Upload */}
        {!uploadedFile ? (
          <button onClick={() => fileRef.current.click()}
            className="w-72 border-2 border-dashed rounded-xl p-4 text-sm">
            <Upload size={20} />
            Upload Audio
          </button>
        ) : (
          <div className="text-green-600 text-sm">{uploadedFile}</div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          hidden
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />

        {/* 📝 TEXT INPUT BUTTON */}
        <button
          onClick={() => setShowTextInput(true)}
          className="text-sm px-4 py-2 border rounded-lg"
        >
          Paste Text Instead
        </button>

        {/* 🔒 VIEW BUTTON */}
        {transcript && !showTranscript && (
          <button
            onClick={() => setShowTranscript(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg"
          >
            View Analysis
          </button>
        )}

      </div>

      {/* 📝 TEXT INPUT MODAL */}
      {showTextInput && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">

            <h2 className="mb-2 font-semibold">Paste Text</h2>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-28 border p-2 rounded"
              placeholder="Enter conversation..."
            />

            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowTextInput(false)}>Cancel</button>
              <button
                onClick={() => {
                  handleTextInput(inputText);
                  setShowTextInput(false);
                  setInputText("");
                }}
                className="bg-brand-600 text-white px-3 py-1 rounded"
              >
                Analyze
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔥 ANALYSIS MODAL */}
      {showTranscript && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[95%] max-w-2xl">

            <h2 className="text-lg font-semibold mb-3">Consultation Analysis</h2>

            {/* Transcript */}
            <div className="mb-4">
              <p className="text-xs text-gray-400">Transcript</p>
              <div className="bg-gray-100 p-3 rounded">{transcript}</div>
            </div>

            {/* Summary */}
            {analysis?.summary && (
              <div className="mb-4">
                <p className="text-xs text-gray-400">Summary</p>
                <div className="bg-blue-100 p-3 rounded">{analysis.summary}</div>
              </div>
            )}

            {/* JSON */}
            {analysis && (
              <pre className="bg-black text-green-400 p-3 text-xs rounded overflow-x-auto">
                {JSON.stringify(analysis, null, 2)}
              </pre>
            )}

            <div className="flex justify-end mt-4">
              <button onClick={() => setShowTranscript(false)}>Close</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}