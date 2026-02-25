import React, { useState, useRef } from 'react';
import { chatWithMochi, ChatMessage } from '../services/ReinforcedLearningService';
import MochiAvatar from '../components/ReinforcedLearning/MochiAvatar';
import FeedbackBubble from '../components/ReinforcedLearning/FeedbackBubble';
import InteractionPill from '../components/ReinforcedLearning/InteractionPill';
import ChatHistory from '../components/ReinforcedLearning/ChatHistory';
import ArrowLeft from '../components/ui/ArrowLeft';
import CorrectionCard from '../components/ReinforcedLearning/CorrectionCard';
import { PHONETIC_DICTIONARY, getPhoneticBreakdown, WordData } from '@/services/PhoneticDictionary';

export default function ReinforcedLearning() {
  const [feedback, setFeedback] = useState("");
  const [mood, setMood] = useState<string>("HAPPY");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioContextRef = useRef<any>(null);
  const wakeWordRecognition = useRef<any>(null);
  const audioChunks = useRef<BlobPart[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const [history, setHistory] = useState<ChatMessage[]>([]); // Stores the chat messages
  const scrollRef = useRef<HTMLDivElement>(null); // Helps us scroll to the latest message

  const [correctionData, setCorrectionData] = useState<{user: string, target: WordData} | null>(null);
  const [mistakeList, setMistakeList] = useState<{user: string, target: WordData}[]>([]);

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

  //"HEY MOCHI" Wake Word Function
  React.useEffect(() => {

    //Check for browser support
    const SpeechRecognition = (window as any).window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Browser does not support Speech Recognition API");
      return;
    }

    if (!wakeWordRecognition.current) {
      wakeWordRecognition.current = new SpeechRecognition();
      wakeWordRecognition.current.continuous = true;
      wakeWordRecognition.current.interimResults = false;
      wakeWordRecognition.current.lang = 'en-US';
    }

    const recognition = wakeWordRecognition.current;

    recognition.onresult = (event: any) => {
      const lastResultIndex = event.results.length - 1;
      const transcript = event.results[lastResultIndex][0].transcript.toLowerCase();

      console.log("Background Listener Heard:", transcript);

      //The trigger word is "Hey Mochi"
      if (transcript.includes("hey mochi") || transcript.includes("hi mochi")) {
        console.log("Wake word detected!");

        recognition.stop(); // Stop listening to prevent overlap with main recording

        setFeedback("Yes? I'm listening! ✨");
        setMood("HAPPY");

        //Wait half a second before starting the main recording 
        setTimeout(() => {
         startRecording();
        }, 500);
      }
    };

    //Automatically restart the wake word listener if it stops and we're not currently recording or processing
    recognition.onend = () => {
      if (!isRecording && !isThinking) {
        setTimeout(() => {

          try { 
            recognition.start(); 
          } catch (e) {}
        }, 400);
      }
    };

    if (!isRecording && !isThinking) {
      setTimeout(() => {
        try {
          recognition.start();
        } catch (e) {}
      }, 400);
    } else {
      try { 
        recognition.stop(); 
      } catch (e) {}
    }

    // Cleanup when component re-renders
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      try { 
        recognition.stop(); 
      } catch(e) {}
    };

  }, [isRecording, isThinking]);

  // FUNCTION: Start Recording Audio
  const startRecording = async () => {

    if (wakeWordRecognition.current) {
      wakeWordRecognition.current.onend = null; // Stop it from auto-restarting
      try { 
        wakeWordRecognition.current.stop(); 
      } catch(e) {}
    }

    // Clear any previous correction data when starting a new recording session
    setCorrectionData(null);

    // Request access to the microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Set up the MediaRecorder to capture audio
    mediaRecorder.current = new MediaRecorder(stream) as any;
    audioChunks.current = [];

    // When audio data is available, save it to the chunks array
    mediaRecorder.current.ondataavailable = (e: any) => {
      audioChunks.current.push(e.data);
    };

    // When recording stops, create a Blob from the audio chunks and send it to Backend
    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      sendAudioToMochi(audioBlob);
    };

    // Start recording 
    mediaRecorder.current.start();
    setIsRecording(true);

    //Silence Detection Logic: Stop recording after 1.5s of silence

    // Set up the AudioContext and AnalyserNode to monitor the audio stream
    const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser); // Connect the mic to the analyser

    // fftSize determines how detailed the audio analysis is. 512 is standard for voice detection
    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;

    // Create an empty array to hold the volume data
    const dataArray = new Uint8Array(bufferLength);

    // Variables to track the child's speaking state
    let silenceStart = Date.now();
    let hasSpoken = false;
    let animationFrameId: number;

    // The main loop that run 60 times per second to check the volume levels
    const detectSilence = () => {
      // If we manually stopped, exit the loop
      if (mediaRecorder.current?.state !== 'recording') return;

      // Fill the dataArray with the current volume levels from the microphone
      analyser.getByteFrequencyData(dataArray);

      // Calculate the average volume of the room by adding up all frequencies
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const averageVolume = sum / bufferLength;

      // Sensitivity scale: We can adjust this threshold for testing in different environments
      // This is the average volume that counts as "Talking". This depends on the noice levels of the environment
      const volumeThreshold = 10;

      if (averageVolume > volumeThreshold) {
        hasSpoken = true; //The child has started speaking
        silenceStart = Date.now(); //Reset the silence timer
      } else {
        // If they HAVE spoken, and have now been silent for 1.5 seconds (1500ms), we stop the recording
        if (hasSpoken && (Date.now() - silenceStart > 1500)) {
          console.log("🛑 Silence detected! Auto-stopping microphone.");
          stopRecording(); // Stop the recording
          cancelAnimationFrame(animationFrameId);
          return; // Exit the loop to prevent multiple stops
        }
      }

      // Keep looping and checking the volume
      animationFrameId = requestAnimationFrame(detectSilence);
    };

    // Start the silence detection loop
    detectSilence(); 
  };

  // FUNCTION: Stop Recording Audio 
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
    setIsRecording(false);

    // Shut down the silence detector to save CPU
    // If this is not closed, the browser will keep analyzing the mic input in the background, which can cause performance issues and battery drain
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  // FUNCTION: Send Audio File to Backend
  const sendAudioToMochi = async (blob: Blob) => {

    setFeedback("Mochi is listening... ✨");
    setIsThinking(true);

    try {
      const res = await chatWithMochi(blob, history);
      const { transcription, mochiResponse, mood: aiMood } = res;

      const lowerText = (transcription || "").toLowerCase();
      console.log("User said:", lowerText);

      if (lowerText.includes("wabbit") || lowerText.includes("wed")) {

        const targetWord = lowerText.includes("wabbit") ? "rabbit" : "red";
        const breakdown = getPhoneticBreakdown(targetWord);

        if (breakdown) {

          console.log("Triggering Correction for:", targetWord);

          const userMispronunciation = lowerText.includes("wed") ? "Wed" : "Wabbit";
          setCorrectionData({ user: userMispronunciation, target: breakdown });

          setMistakeList(prev => [...prev, { user: userMispronunciation, target: breakdown }]);

          setFeedback("Let's try that one again!");
          setMood("ENCOURAGING");
          setIsThinking(false);
          return;
        }
      }

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
  
  const playCorrectionAudio = (text: string, rate: number) => {
    const synth = window.speechSynthesis;
    synth.cancel(); // Stops any currently playing audio
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;  // 1.0 is normal speed, 0.5 is slow mode
    u.pitch = 1.1;
    synth.speak(u);
  };
  
  return (
    <div className="h-screen w-full flex bg-[#f0f9ff] overflow-hidden">

      <ArrowLeft />
    
      {/* LEFT SIDE: HISTORY BAR */}
      <ChatHistory history={history} scrollRef={scrollRef} />

      {/* RIGHT SIDE: MOCHI INTERACTION */}
      <div className="flex-1 h-screen flex flex-col items-center justify-center p-6 relative">

        {/* FLOATING CORRECTION WIDGET*/}
        {correctionData && (
          <div className="absolute top-1/4 right-8 z-[100] hidden lg:block">
            <CorrectionCard 
              userWord={correctionData.user} 
              targetData={correctionData.target}
              onClose={() => setCorrectionData(null)}
            />
          </div>
        )}

        <div className="flex flex-col items-center justify-center w-full max-w-2xl gap-5 transition-all duration-500">
            
            <div className="transform scale-100 transition-transform duration-700">
              <MochiAvatar 
                mood={mood} 
                isThinking={isThinking} 
              />

              <div className="w-full flex justify-center items-start min-h-[4rem]">
                <FeedbackBubble feedback={feedback} mood={mood} />
              </div>

            </div>

            <div className="w-full flex justify-center mt-4">
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
