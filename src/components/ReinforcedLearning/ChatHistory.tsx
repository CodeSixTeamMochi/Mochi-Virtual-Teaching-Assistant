import React from 'react';
import { ChatMessage } from '../../services/ReinforcedLearningService';

interface ChatHistoryProps {
  history: ChatMessage[];
  scrollRef: React.RefObject<HTMLDivElement>;
}

export default function ChatHistory({ history, scrollRef }: ChatHistoryProps) {
    return (
    <div className="w-80 bg-white/60 backdrop-blur-md border-r border-white/40 flex flex-col px-6 pb-6 pt-24 shadow-xl z-30">
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
  );
}
