import React, { useState, useEffect } from 'react';
import { Volume2, RefreshCcw, AlertCircle, X } from 'lucide-react';
import { WordData } from '../../services/PhoneticDictionary';

interface CorrectionCardProps {
    userWord: string;     // What the child said (e.g. "wed")
    targetData: WordData; // The correct data (e.g. "red")
    onClose: () => void;
}

export default function CorrectionCard({
    userWord, 
    targetData,
    onClose 

}: CorrectionCardProps) {
    // State to track which letter is currently being spoken
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Clean up any playing audio if the card is closed
    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    // Sync animation with Speech Synthesis
    const playAudioWithHighlight = (rate: number) => {
        const synth = window.speechSynthesis;
        synth.cancel(); // Stop any current audio
    
        const utterance = new SpeechSynthesisUtterance(targetData.word);
        utterance.rate = rate;
        utterance.pitch = 1.1;

         // Estimate time per phoneme (Normal ~ 250ms, Slow ~ 500ms)
        const timePerPhoneme = rate === 1.0 ? 250 : 500;

        utterance.onstart = () => {
            let current = 0;
            setActiveIndex(current);

            const interval = setInterval(() => {
                current++;
                if (current >= targetData.phonemes.length) {
                    clearInterval(interval);
                    // Let the last letter stay lit briefly before turning off
                    setTimeout(() => setActiveIndex(null), timePerPhoneme);
                } else {
                     setActiveIndex(current);
                }
            }, timePerPhoneme);

            // stop animation when audio completely finishes
            utterance.onend = () => {
                clearInterval(interval);
                setActiveIndex(null);
            };
        };
    
        synth.speak(utterance);
    };

    return (
        <div className="w-full max-w-sm bg-white/95 backdrop-blur-md border-2 border-red-100 rounded-[24px] p-5 shadow-2xl animate-in slide-in-from-right-8 duration-500 relative">

            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors z-20"
            >
                <X size={16} />   
            </button>

            <div className="flex items-start gap-3 mb-4 pr-6">
                <div className="bg-red-100 p-2.5 rounded-full animate-pulse shrink-0">
                    <AlertCircle className="text-red-500" size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-extrabold text-slate-800 mb-0.5">Oops! Close one.</h3>
                    <p className="text-slate-500 text-sm md:text-base leading-snug">
                        I heard <span className="font-bold text-red-500 underline decoration-wavy decoration-red-300">"{userWord}"</span>.
                    </p>
                    <p className="text-slate-500 text-sm md:text-base">
                        Did you mean <span className="font-bold text-indigo-600">"{targetData.word}"</span>?
                    </p>
                </div>
            </div>

            {/*Phoneme breakdown with karaoke animation*/}

            <div className="flex flex-col items-center justify-center gap-3 mb-5 bg-slate-50 py-6 rounded-2xl border border-slate-200 shadow-inner relative overflow-hidden">

                <div className="absolute top-2 right-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Focus Sound: /{targetData.targetSound}/
                </div>

                <div className="flex items-end gap-1.5 mt-2">
                    {targetData.phonemes.map((pho, index) => {
                        const isTarget = pho.includes(targetData.targetSound) || targetData.targetSound.includes(pho);
                        const isActive = activeIndex === index;

                        return (
                            <div key={index} className="flex flex-col items-center gap-1.5 relative">
                                <span 
                                    className={`text-3xl sm:text-4xl font-black transition-all duration-200 ${
                                        isActive
                                            ? 'text-yellow-400 -translate-y-2 scale-110 drop-shadow-[0_5px_5px_rgba(250,204,21,0.4)] z-10'
                                            : isTarget 
                                            ? 'text-indigo-600 -translate-y-2 scale-105 drop-shadow-sm' 
                                            : 'text-slate-300'
                                    }`}
                                >
                                    {pho}
                                </span>
                                
                                {/*Active indicator dot*/}

                                {isActive && (
                                    <div className="absolute -bottom-4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
                                )}

                                {isTarget && !isActive && (
                                    <div className="absolute -bottom-3 w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                                )}

                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => playAudioWithHighlight(1.0)}
                    className="group flex items-center justify-center gap-2 py-3 px-2 bg-indigo-50 text-indigo-700 font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all duration-300 border-2 border-indigo-100 hover:border-indigo-600 text-sm"
                >
                    <div className="bg-white group-hover:bg-indigo-500 p-1.5 rounded-full transition-colors text-indigo-600 group-hover:text-white">
                        <Volume2 size={16} />
                    </div>
                    <span>Listen</span>
                </button>

                <button 
                    onClick={() => playAudioWithHighlight(0.5)}
                    className="group flex items-center justify-center gap-2 py-3 px-2 bg-emerald-50 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-600 hover:text-white transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-600 text-sm"
                >
                    <div className="bg-white group-hover:bg-emerald-500 p-1.5 rounded-full transition-colors text-emerald-600 group-hover:text-white">
                        <RefreshCcw size={16} />
                    </div>
                    <span>Slow Mode</span>
                </button>
            </div>

        </div>
    );
}