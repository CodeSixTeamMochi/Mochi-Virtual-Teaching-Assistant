import React, { useState, useRef } from 'react';
import { chatWithMochi, ChatMessage } from '../services/ReinforcedLearningService';
import MochiAvatar from '../components/ui/MochiAvatar';
import FeedbackBubble from '../components/ui/FeedbackBubble';
import InteractionPill from '../components/ui/InteractionPill';
import ChatHistory from '../components/ui/ChatHistory';
import ArrowLeft from '../components/ui/ArrowLeft';

export default function ReinforcedLearning() {
  const [feedback, setFeedback] = useState("");
  const [mood, setMood] = useState<string>("HAPPY");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef<BlobPart[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const [history, setHistory] = useState<ChatMessage[]>([]); // Stores the chat messages
  const scrollRef = useRef<HTMLDivElement>(null); // Helps us scroll to the latest message

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
  const sendAudioToMochi = async (blob: Blob) => {

    setFeedback("Mochi is listening... ✨");
    setIsThinking(true);

    try {
      const res = await chatWithMochi(blob, history);
      const { transcription, mochiResponse, mood: aiMood } = res;

      setHistory(prev => [
        ...prev, 
        { role: 'child', text: transcription || "I was talking!" }, 
        { role: 'mochi', text: mochiResponse }
      ]);
      
      setFeedback(mochiResponse);
      if (aiMood) setMood(aiMood);
      
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
      setIsThinking(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#f0f9ff] overflow-hidden">

      <ArrowLeft />
      
      {/* LEFT SIDE: HISTORY BAR */}
      <ChatHistory history={history} scrollRef={scrollRef} />

      {/* RIGHT SIDE: MOCHI INTERACTION */}
      <div className="flex-1 h-screen flex flex-col items-center justify-center p-6 relative">

        <div className="flex flex-col items-center justify-center w-full max-w-2xl gap-5 transition-all duration-500">
            
            <div className="transform scale-100 transition-transform duration-700">
              <MochiAvatar 
                mood={mood} 
                isThinking={isThinking} 
              />

              <div className="w-full flex justify-center items-start min-h-[2rem]">
                <FeedbackBubble 
                  feedback={feedback} 
                  mood={mood} 
                />
              </div>

            </div>

            <div className="w-full flex justify-center">
              <InteractionPill 
                isThinking={isThinking}
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
                mood={mood}
              />
            </div>
        </div>
      </div>
    </div>
  );
}
