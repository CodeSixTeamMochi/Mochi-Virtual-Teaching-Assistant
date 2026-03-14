import React from 'react';
import mochiWavingGif from '../../assets/mochi_waving.gif';

interface MochiAvatarProps {
  mood: string;
  isThinking: boolean;
}

export default function MochiAvatar({ mood, isThinking }: MochiAvatarProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative">
                <img 
                src={mochiWavingGif} 
                alt="Mochi" 
                className={`w-96 h-96 object-contain transition-all duration-700
                    ${mood === 'CELEBRATING' ? 'scale-110 drop-shadow-[0_0_50px_rgba(250,204,21,0.6)] -translate-y-4' : ''}
                    ${mood === 'ENCOURAGING' ? 'brightness-110 drop-shadow-[0_0_40px_rgba(134,239,172,0.5)]' : ''}
                    ${isThinking ? 'animate-pulse opacity-70' : ''}
                `}
                />
                {mood === 'CELEBRATING' && (
                    <div className="absolute -top-4 right-10 text-5xl animate-bounce">⭐</div>
                )}
            </div>
        </div>
    );
}