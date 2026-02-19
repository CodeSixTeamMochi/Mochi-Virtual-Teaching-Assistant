import React from 'react';
import { Volume2, RefreshCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WordData } from '../../services/PhoneticDictionary';

interface CorrectionCardProps {
    userWord: string;     // What the child said (e.g. "wed")
    targetData: WordData; // The correct data (e.g. "red")
    onPlayReference: () => void;
    onPlaySlow: () => void;
}

export default function CorrectionCard({
    userWord, 
    targetData, 
    onPlayReference, 
    onPlaySlow
}: CorrectionCardProps) {

    return (
        <div className="w-full max-w-lg bg-white/95 backdrop-blur-md border-2 border-red-100 rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">

            <div className="flex items-start gap-4 mb-8">
                <div className="bg-red-100 p-4 rounded-full animate-pulse shrink-0">
                    <AlertCircle className="text-red-500" size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-extrabold text-slate-800 mb-1">Oops! Close one.</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        I heard <span className="font-bold text-red-500 underline decoration-wavy decoration-red-300">"{userWord}"</span>.
                    </p>
                    <p className="text-slate-500 text-lg">
                        Did you mean <span className="font-bold text-indigo-600">"{targetData.word}"</span>?
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 mb-8 bg-slate-50 py-8 rounded-3xl border border-slate-200 shadow-inner relative overflow-hidden">

                <div className="absolute top-2 right-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Focus Sound: /{targetData.targetSound}/
                </div>

                <div className="flex items-end gap-1">
                    {targetData.phonemes.map((pho, index) => {
                        const isTarget = pho.includes(targetData.targetSound) || targetData.targetSound.includes(pho);

                        return (
                            <div key={index} className="flex flex-col items-center gap-2">
                                <span 
                                    className={`text-5xl font-black transition-all duration-500 ${
                                        isTarget 
                                            ? 'text-indigo-600 -translate-y-2 scale-110 drop-shadow-md' 
                                            : 'text-slate-300'
                                    }`}
                                >
                                    {pho}
                                </span>

                                {isTarget && (
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                    onClick={onPlayReference}
                    className="group flex items-center justify-center gap-3 py-4 px-6 bg-indigo-50 text-indigo-700 font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all duration-300 border-2 border-indigo-100 hover:border-indigo-600"
                >
                    <div className="bg-white group-hover:bg-indigo-500 p-2 rounded-full transition-colors">
                        <Volume2 size={20} />
                    </div>
                    <span>Listen</span>
                </button>

                <button 
                    onClick={onPlaySlow}
                    className="group flex items-center justify-center gap-3 py-4 px-6 bg-emerald-50 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-600 hover:text-white transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-600"
                >
                    <div className="bg-white group-hover:bg-emerald-500 p-2 rounded-full transition-colors">
                        <RefreshCcw size={20} />
                    </div>
                    <span>Slow Mode</span>
                </button>
            </div>

        </div>
    );
}