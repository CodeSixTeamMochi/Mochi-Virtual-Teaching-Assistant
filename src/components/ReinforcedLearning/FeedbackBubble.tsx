import React from 'react';

interface FeedbackBubbleProps {
  feedback: string;
  mood: string;
}

export default function FeedbackBubble({ feedback, mood }: FeedbackBubbleProps) {

    if (!feedback) return null;

    return (
    <div className={`mt-8 min-h-[60px] px-8 py-6 backdrop-blur-sm rounded-3xl shadow-sm border max-w-2xl text-center transition-all duration-500
      ${mood === 'CELEBRATING' ? 'bg-yellow-50/90 border-yellow-200 scale-105' : 'bg-white/80 border-slate-100'}
    `}>
        <p className={`text-xl font-medium leading-relaxed transition-colors
        ${mood === 'CELEBRATING' ? 'text-yellow-700' : 'text-slate-600'}
      `}>
        {feedback}
      </p>
    </div>
    );
}