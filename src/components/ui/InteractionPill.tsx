import React from 'react';
import { Mic, Square } from 'lucide-react';

interface InteractionPillProps {
  isThinking: boolean;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  mood: string;
}

export default function InteractionPill({ 
  isThinking, 
  isRecording, 
  startRecording, 
  stopRecording, 
  mood 
}: InteractionPillProps) {

    return (
        <div className="w-full max-w-lg relative z-20">
            <div className={`rounded-full shadow-lg flex items-center p-3 pl-8 border border-white/50 justify-between transition-colors duration-500
                ${mood === 'CELEBRATING' ? 'bg-yellow-50' : 'bg-white'}
            `}>
        
                <p className="text-base text-slate-400 font-medium italic">
                    {isThinking ? "Mochi is thinking..." : isRecording ? "Listening to you..." : "Tap the mic to talk to Mochi"}
                </p>

                <button
                    disabled={isThinking} 
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-4 rounded-full transition-all duration-300 ${
                    isThinking ? 'bg-slate-200 cursor-not-allowed opacity-50' :
                    isRecording ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                    'bg-[#ffb37b] text-white shadow-md hover:scale-105 active:scale-95'
                    }`}
                >
                    {isRecording ? <Square size={24} fill="currentColor" /> : <Mic size={24} />}

                </button>
            </div>
        </div>
    );
}

    