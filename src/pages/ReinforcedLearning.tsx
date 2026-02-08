import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Mic, Square } from 'lucide-react';

export default function ReinforcedLearning() {
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const [isThinking, setIsThinking] = useState(false);
  const [history, setHistory] = useState([]); // Stores the chat messages
  const scrollRef = useRef(null); // Helps us scroll to the latest message

  const cleanTextForNaturalSpeech = (text) => {
    return text
      .replace(/\./g, ",")  // Swap full stops for commas for shorter, natural pauses
      .replace(/\!/g, ".")  // Soften exclamations
      .trim();
  };

  // Wakes up the browser's voice engine as soon as the page loads
  React.useEffect(() => {
    const synth = window.speechSynthesis;
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => synth.getVoices();
    }
    synth.getVoices(); // Initial trigger
  }, []);

  // Auto-scroll the history bar whenever a new message is added
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

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
    setIsThinking(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat-with-mochi', formData);
      const { transcription, mochiResponse } = res.data;

      setHistory(prev => [
        ...prev, 
        { role: 'child', text: transcription || "..." }, 
        { role: 'mochi', text: mochiResponse }
      ]);
      
      setFeedback(mochiResponse);
      
      // MOCHI VOICE LOGIC
      const synth = window.speechSynthesis;
      // 1. Clean the text for natural breaths (swapping . for ,)
      const naturalText = cleanTextForNaturalSpeech(mochiResponse);
      const utterance = new SpeechSynthesisUtterance(naturalText);

      const voices = synth.getVoices();
      const friendlyVoice = voices.find(v => 
        v.name.includes('Samantha') || 
        v.name.includes('Female') || 
        v.name.includes('Google US English')
      );

      if (friendlyVoice) utterance.voice = friendlyVoice;
      utterance.pitch = 1.2; // Playful pitch
      utterance.rate = 0.9; // Slightly slower for child comprehension
      utterance.onend = () => setIsThinking(false);

      synth.speak(utterance);

    } catch (err) {
      console.error(err);
      setFeedback("Mochi's brain is offline! Check your Python terminal.");
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#f0f9ff] overflow-hidden">
      {/* LEFT SIDE: HISTORY BAR */}
      <div className="w-80 bg-white/60 backdrop-blur-md border-r border-white/40 flex flex-col p-6 shadow-xl z-30">
        <h2 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
          <span>📜</span> Story So Far
        </h2>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {history.length === 0 ? (
            <p className="text-slate-400 italic text-sm mt-4">No messages yet. Say hello!</p>
          ) : (
            history.map((chat, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-2xl text-sm shadow-sm ${
                  chat.role === 'mochi' 
                    ? 'bg-[#ffb37b] text-white rounded-bl-none ml-2' 
                    : 'bg-white text-slate-600 rounded-br-none mr-2 border border-slate-100'
                }`}
              >
                <p className="font-bold text-[10px] uppercase opacity-70 mb-1">
                  {chat.role === 'mochi' ? 'Mochi' : 'You'}
                </p>
                {chat.text}
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT SIDE: MOCHI INTERACTION */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-8">
        <div className="flex-1 flex flex-col items-center justify-center">
          <img 
            src="/mochi_waving.gif" 
            alt="Mochi" 
            className={`w-96 h-96 object-contain transition-all duration-700`} 
          />
          <h1 className="text-5xl font-extrabold text-[#334155] mt-6 tracking-tight">Hello! I'm Mochi</h1>
        </div>
    
        {/* THE INTERACTION PILL */}
        <div className="w-full max-w-xl mb-12 relative z-20">
          <div className="bg-white rounded-[50px] shadow-2xl flex items-center p-4 border border-white justify-between">
            <p className="text-xl text-gray-400 px-6 italic">
              {isThinking ? "Mochi is thinking..." : isRecording ? "Listening to you..." : "Tap the mic to talk to Mochi"}
            </p>

            <button
              disabled={isThinking} 
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-6 rounded-full transition-all duration-300 ${
                isThinking ? 'bg-slate-200 cursor-not-allowed opacity-50' :
                isRecording ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' :
                'bg-[#ffb37b] text-white shadow-lg hover:scale-110 active:scale-95'
              }`}
            >
              {isRecording ? <Square size={32} /> : <Mic size={32} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
