import { useState, useRef, useEffect } from 'react';

export function useRecorder() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      if (!recording) setSeconds(0);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  const toggle = () => setRecording(r => !r);

  const handleUpload = (file) => {
    if (file) setUploadedFile(file.name);
  };

  const formatTime = () => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return { recording, toggle, formatTime, uploadedFile, handleUpload };
}
