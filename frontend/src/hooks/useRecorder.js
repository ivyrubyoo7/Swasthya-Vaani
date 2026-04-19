import { useState, useRef } from "react";

export function useRecorder() {
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [fhir, setFhir] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // 🎤 START RECORDING
  const startRecording = async () => {
    try {
      // 🔥 USE RECORDER STATE (NOT React state)
      if (mediaRecorderRef.current?.state === "recording") return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("🛑 Recording stopped");

        // stop mic
        streamRef.current?.getTracks().forEach((track) => track.stop());

        // ensure chunks are ready before upload
        setTimeout(() => {
          uploadAudio();
        }, 200);
      };

      mediaRecorder.start();

      timerRef.current = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);

      setRecording(true);
      console.log("🎤 Recording started");
    } catch (err) {
      console.error("❌ Mic error:", err);
    }
  };

  // 🛑 STOP RECORDING
  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) {
      console.log("❌ No recorder");
      return;
    }

    if (recorder.state !== "recording") {
      console.log("⚠️ Not recording:", recorder.state);
      return;
    }

    console.log("🛑 Stop triggered");

    recorder.stop();

    clearInterval(timerRef.current);
    setRecording(false);
    setTime(0);
  };

  // 🔁 TOGGLE (CRITICAL FIX)
  const toggle = () => {
    const recorder = mediaRecorderRef.current;

    // 🔥 RELY ON REAL RECORDER STATE
    if (recorder && recorder.state === "recording") {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // 📤 MIC AUDIO → BACKEND
  const uploadAudio = async () => {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = [];

    const formData = new FormData();
    formData.append("file", blob, "recording.webm");

    try {
      const res = await fetch("http://127.0.0.1:8000/upload-audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Mic response:", data);

      setTranscript(data.text || "");
      setAnalysis(data.analysis || null);
      setFhir(data.fhir || null);
    } catch (err) {
      console.error("Mic upload failed", err);
    }
  };

  // 📁 FILE UPLOAD
  const handleUpload = async (file) => {
    if (!file) return;

    setUploadedFile(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload-audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Upload response:", data);

      setTranscript(data.text || "");
      setAnalysis(data.analysis || null);
      setFhir(data.fhir || null);
    } catch (err) {
      console.error("File upload failed", err);
    }
  };

  // 📝 TEXT INPUT
  const handleTextInput = async (text) => {
    if (!text.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      console.log("Text response:", data);

      setTranscript(data.text || "");
      setAnalysis(data.analysis || null);
      setFhir(data.fhir || null);
    } catch (err) {
      console.error("Text analysis failed", err);
    }
  };

  // ⏱️ TIMER
  const formatTime = () => {
    const min = String(Math.floor(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  return {
    recording,
    toggle,
    formatTime,
    uploadedFile,
    handleUpload,
    handleTextInput,
    transcript,
    analysis,
    fhir,
  };
}