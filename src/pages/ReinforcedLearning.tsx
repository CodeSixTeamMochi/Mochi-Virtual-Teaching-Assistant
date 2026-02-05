import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mic } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

function App() {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isListening, setIsListening] = useState(false);
  const targetWord = "Apple"; // This is what the child is trying to say

  // FUNCTION A: Make Mochi Talk
  const speak = (text) => {
    window.speechSynthesis.cancel(); // Stop any current speaking
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.4; // High pitch for Mochi
    utterance.rate = 0.9;  // Slower for kids
    window.speechSynthesis.speak(utterance);
  };

  // FUNCTION B: Send to Python Backend
  const getAIResponse = async (childSpeech) => {
    setFeedback("Mochi is thinking...");
    try {
      const response = await axios.post('http://localhost:5000/api/correction', {
        text: childSpeech,
        target: targetWord
      });
      
      const aiData = response.data;
      setFeedback(aiData.mochi_feedback);
      speak(aiData.mochi_feedback); // This is what makes it like Lovable!
    } catch (error) {
      setFeedback("Error: Is your Python backend running on port 5000?");
    }
  };

  // FUNCTION C: Listen to the Child
  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Please use Chrome");

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      getAIResponse(transcript); // Automatically sends to AI
    };

    recognition.start();
  };

  return (
    <div className="h-screen w-full flex flex-col items-center bg-[#f0f9ff] py-12 px-4 overflow-hidden relative font-sans">
      <div className="flex-1 flex flex-col items-center justify-center">
        <img src="/mochi_waving.gif" alt="Mochi" className="w-80 h-80 object-contain" />
        <h1 className="text-5xl font-extrabold text-[#334155] mt-6">Hello! I'm Mochi</h1>
      </div>

      <div className="w-full max-w-2xl mb-16">
        <div className="bg-white rounded-[50px] shadow-xl flex items-center p-2 border border-white">
          <input 
            className="flex-1 bg-transparent px-8 py-4 text-xl text-gray-400 outline-none"
            value={input}
            placeholder="Tap the mic to talk..."
            readOnly
          />
          <button 
            onClick={handleMicClick}
            className={`p-4 mx-1 rounded-full ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-gray-300'}`}
          >
            <Mic size={32} />
          </button>
        </div>
      </div>

      {feedback && (
        <div className="absolute bottom-48 bg-white p-8 rounded-[35px] rounded-bl-none shadow-2xl border-l-8 border-[#ffb37b] max-w-md">
          <p className="text-xl text-slate-700 italic">"{feedback}"</p>
        </div>
      )}
    </div>
  );
}

export default App;