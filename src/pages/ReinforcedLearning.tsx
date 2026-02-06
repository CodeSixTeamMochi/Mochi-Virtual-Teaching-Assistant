import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Mic, Square } from 'lucide-react';

export default function ReinforcedLearning() {
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  // FUNCTION: Start Recording Audio
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      sendAudioToMochi(audioBlob);
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };

  // FUNCTION: Send Audio File to Backend
  const sendAudioToMochi = async (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');

    setFeedback("Mochi is listening... ✨");

    try {
      const res = await axios.post('http://localhost:5000/api/chat-with-mochi', formData);
      const mochiText = res.data.mochiResponse;
      
      setFeedback(mochiText);
      
      // TRIGGER BROWSER TTS (Mochi's Voice)
      const speech = new SpeechSynthesisUtterance(mochiText);
      speech.pitch = 1.5;
      window.speechSynthesis.speak(speech);

    } catch (err) {
      setFeedback("Mochi's brain is offline! Check your Python terminal.");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center bg-[#f0f9ff] py-12 px-4 overflow-hidden relative">
      <div className="flex-1 flex flex-col items-center justify-center">
        <img src="/mochi_waving.gif" alt="Mochi" className="w-80 h-80 object-contain" />
        <h1 className="text-5xl font-extrabold text-[#334155] mt-6">Hello! I'm Mochi</h1>
      </div>

      {/* THE INTERACTION PILL */}
      <div className="w-full max-w-2xl mb-16 relative z-20">
        <div className="bg-white rounded-[50px] shadow-2xl flex items-center p-4 border border-white justify-between">
          <p className="text-xl text-gray-400 px-6">
            {isRecording ? "Listening to you..." : "Tap the mic to talk to Mochi"}
          </p>

          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-6 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[#ffb37b] text-white shadow-lg'}`}
          >
            {isRecording ? <Square size={32} /> : <Mic size={32} />}
          </button>
        </div>
      </div>

      {/* FEEDBACK BUBBLE */}
      {feedback && (
        <div className="absolute bottom-52 bg-white p-8 rounded-[35px] rounded-bl-none shadow-2xl border-l-8 border-[#ffb37b] max-w-md animate-in fade-in slide-in-from-bottom-6">
          <p className="text-xl text-slate-700 font-medium italic">"{feedback}"</p>
        </div>
      )}
    </div>
  );
}
