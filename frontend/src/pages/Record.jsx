import { useRef, useState } from 'react';
import { Mic, MicOff, Upload, ShieldCheck } from 'lucide-react';
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
    handleTextInput,
    fhir
  } = useRecorder();

  const fileRef = useRef();

  const [showTranscript, setShowTranscript] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [inputText, setInputText] = useState("");

  return (
    <div className="animate-fade-in flex flex-col h-full px-4 pb-6 text-slate-800 dark:text-slate-200">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="font-display text-[22px] font-semibold text-slate-900 dark:text-white">
          Record Consultation
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Tap the mic to start capturing clinical notes
        </p>
      </div>

      {/* MAIN */}
      <div className="flex flex-col items-center gap-6 flex-1">

        {/* 🎤 MIC */}
        <div className="relative flex items-center justify-center">
          {recording && (
            <span className="absolute w-24 h-24 rounded-full bg-red-400 opacity-20 animate-ping" />
          )}
          <button
            onClick={toggle}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-lg transition
            ${recording ? 'bg-red-500' : 'bg-brand-600'}`}
          >
            {recording
              ? <MicOff size={32} className="text-white" />
              : <Mic size={32} className="text-white" />}
          </button>
        </div>

        {/* TIMER */}
        {recording && (
          <p className="text-sm text-red-400">● {formatTime()}</p>
        )}

        {/* PRIVACY */}
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <ShieldCheck size={13} />
          Your data stays private
        </div>

        {/* UPLOAD */}
        {!uploadedFile ? (
          <button
            onClick={() => fileRef.current.click()}
            className="w-full max-w-xs border-2 border-dashed 
            border-slate-300 dark:border-slate-600
            text-slate-700 dark:text-slate-200
            bg-white/50 dark:bg-slate-800/50
            rounded-xl p-4 text-sm flex flex-col items-center gap-2"
          >
            <Upload size={20} className="text-slate-500 dark:text-slate-300" />
            Upload Audio
          </button>
        ) : (
          <div className="text-green-600 dark:text-green-400 text-sm">
            {uploadedFile}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          hidden
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />

        {/* TEXT INPUT */}
        <button
          onClick={() => setShowTextInput(true)}
          className="text-sm px-4 py-2 border border-slate-300 dark:border-slate-600 
          text-slate-700 dark:text-slate-200 
          bg-white dark:bg-slate-800 rounded-lg"
        >
          Paste Text Instead
        </button>

        {/* VIEW */}
        {transcript && !showTranscript && (
          <button
            onClick={() => setShowTranscript(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg"
          >
            View Analysis
          </button>
        )}

      </div>

      {/* TEXT MODAL */}
      {showTextInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-6 rounded-xl w-full max-w-md">

            <h2 className="mb-2 font-semibold">Paste Text</h2>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-28 p-2 rounded border
              bg-white dark:bg-slate-800
              text-slate-800 dark:text-slate-200
              border-slate-300 dark:border-slate-600"
              placeholder="Enter conversation..."
            />

            <div className="flex justify-end gap-2 mt-3">
              <button className="text-slate-600 dark:text-slate-300" onClick={() => setShowTextInput(false)}>
                Cancel
              </button>
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

      {/* ANALYSIS MODAL */}
      {showTranscript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <h2 className="text-lg font-semibold mb-3">Consultation Analysis</h2>

            {/* Transcript */}
            <div className="mb-4">
              <p className="text-xs text-slate-400">Transcript</p>
              <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded text-sm whitespace-pre-wrap">
                {transcript}
              </div>
            </div>

            {/* Summary */}
            {analysis?.summary && (
              <div className="mb-4">
                <p className="text-xs text-slate-400">Summary</p>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded text-sm">
                  {analysis.summary}
                </div>
              </div>
            )}

            {/* JSON */}
            {analysis && (
              <pre className="bg-black text-green-400 p-3 text-xs rounded overflow-x-auto mb-4">
                {JSON.stringify(analysis, null, 2)}
              </pre>
            )}

            {/* FHIR */}
            {fhir && (
              <div>
                <p className="text-xs text-slate-400 mb-1">FHIR Output</p>
                <pre className="bg-purple-900 text-purple-200 p-3 text-xs rounded overflow-x-auto">
                  {JSON.stringify(fhir, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                className="text-slate-600 dark:text-slate-300"
                onClick={() => setShowTranscript(false)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
} 