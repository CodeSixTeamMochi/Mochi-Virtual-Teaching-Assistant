import React, { useState, useRef, useEffect } from 'react';
import { chatWithMochi, ChatMessage } from '../services/ReinforcedLearningService';
import MochiAvatar from '../components/ReinforcedLearning/MochiAvatar';
import FeedbackBubble from '../components/ReinforcedLearning/FeedbackBubble';
import InteractionPill from '../components/ReinforcedLearning/InteractionPill';
import ChatHistory from '../components/ReinforcedLearning/ChatHistory';
import ArrowLeft from '../components/ui/ArrowLeft';
import CorrectionCard from '../components/ReinforcedLearning/CorrectionCard';
import { getPhoneticBreakdown, WordData } from '@/services/PhoneticDictionary';
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';

type CorrectionMode = 'NONE' | 'ASKING_YES_NO' | 'SHOWING_CARD';

export default function ReinforcedLearning() {
  const [feedback, setFeedback] = useState("");
  const [mood, setMood] = useState<string>("HAPPY");
  const [isRecording, setIsRecording] = useState(false);
  const [correctionMode, setCorrectionMode] = useState<CorrectionMode>('NONE');
  const [pendingError, setPendingError] = useState<{user: string, target: WordData} | null>(null);
  const [mistakeList, setMistakeList] = useState<{user: string, target: WordData}[]>([]);

  const mediaRecorder = useRef<any>(null);
  const audioContextRef = useRef<any>(null);
  const wakeWordRecognition = useRef<any>(null);
  const yesNoRecognition = useRef<any>(null); // Dedicated listener for quick Yes/No
  const audioChunks = useRef<BlobPart[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const navigate = useNavigate();

  const [history, setHistory] = useState<ChatMessage[]>([]); // Stores the chat messages
  const scrollRef = useRef<HTMLDivElement>(null); // Helps us scroll to the latest message

  const cleanTextForNaturalSpeech = (text: string) => {
    return text.replace(/\./g, ",").replace(/\!/g, ".").trim();
  };

  const speakMochi = (text: string, onEndCallback?: () => void) => {
     const synth = window.speechSynthesis;
     synth.cancel(); // Clear any existing speech

     const naturalText = cleanTextForNaturalSpeech(text);
     const utterance = new SpeechSynthesisUtterance(naturalText);

     const voices = synth.getVoices();
     const friendlyVoice = voices.find(v =>
      v.name.includes('Samantha') || v.name.includes('Female') || v.name.includes('Google US English')
      );

      if (friendlyVoice) utterance.voice = friendlyVoice;
      utterance.pitch = 1.2;
      utterance.rate = 0.9;

      utterance.onend = () => {
        if (onEndCallback) onEndCallback();
      };

      synth.speak(utterance);

  };


  // Wakes up the browser's voice engine as soon as the page loads
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => synth.getVoices();
    }
    synth.getVoices(); // Initial trigger
  }, []);

  // Auto-scroll the history bar whenever a new message is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleYesNoResult = (isYes: boolean) => {
    // Stop the listener if it's running
    if (yesNoRecognition.current) {
      try {
         yesNoRecognition.current.stop(); 
      } catch (e) {}
    }

    if (isYes) {
      setCorrectionMode('SHOWING_CARD');
      const targetSoundInfo = pendingError?.target.targetSound.includes('r') ? "'rrr'" : `'${pendingError?.target.targetSound}'`;

      speakMochi(`Awesome! Can you say ${pendingError?.target.word} again, with a ${targetSoundInfo} sound?`, () => {
        setFeedback("Try saying it again!");
        setMood("ENCOURAGING");
      });
    }else {
      setCorrectionMode('NONE');
      setPendingError(null);
      setMood("HAPPY");
      speakMochi("Oops, my silly ears! What were we talking about?", () => {
        setFeedback("What were we talking about?");
      });
    }
  }

  const listenForYesNo = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return; // Fallback if browser doesn't support

    const recognition = new SpeechRecognition();
    yesNoRecognition.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setFeedback("Listening for Yes or No...");

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Child answered:", transcript);

      if (transcript.includes('yes') || transcript.includes('yeah') || transcript.includes('yep')) {
        // Child confirmed the mistake!
        handleYesNoResult(true);

      } else if (transcript.includes('no') || transcript.includes('nah') || transcript.includes('nope')) {
        handleYesNoResult(false);

      } else {
        setFeedback("Was that a Yes or a No?");
      }
    };

    recognition.onerror = () => {
       // If voice fails or times out, do nothing! The manual buttons act as the fallback.
      console.log("Speech recognition timed out. Awaiting manual button press.");
      
      setFeedback("Click Yes or No below!");
    };

    recognition.start();
  };

  //"HEY MOCHI" Wake Word Function
  useEffect(() => {

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
      if (!isRecording && !isThinking && correctionMode === 'NONE') {
        setTimeout(() => {

          try { 
            recognition.start(); 
          } catch (e) {}
        }, 400);
      }
    };

    if (!isRecording && !isThinking && correctionMode === 'NONE') {
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

  }, [isRecording, isThinking, correctionMode]);

  // FUNCTION: Start Recording Audio
  const startRecording = async () => {
    if (correctionMode !== 'NONE') return; // Prevent normal recording during correction flow

    if (wakeWordRecognition.current) {
      wakeWordRecognition.current.onend = null; // Stop it from auto-restarting
      try { 
        wakeWordRecognition.current.stop(); 
      } catch(e) {}
    }

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
      const { transcription, mochiResponse, mood: aiMood, speech_error } = res;

      const lowerText = (transcription || "").toLowerCase();
      console.log("User said:", lowerText);

       if (speech_error && correctionMode === 'NONE') {

        console.log("AI Detected an error! Triggering card for:", speech_error.correction_given);

        // Look up the correct word in your phonetic dictionary
        const breakdown = getPhoneticBreakdown(speech_error.correction_given.toLowerCase());

        if (breakdown) {
          // Save the error to pending state

          const newMistake = { user: speech_error.detected_speech, target: breakdown };
          setPendingError(newMistake);
          setMistakeList((prev: {user: string, target: WordData}[]) => [...prev, newMistake]);

          // Enter Asking Mode
          setCorrectionMode('ASKING_YES_NO');

          setFeedback(`Did you mean ${speech_error.correction_given}?`);
          setMood("THINKING");
          setIsThinking(false);

          // Mochi asks the question, then automatically listens for Yes/No
          speakMochi(`I heard ${speech_error.detected_speech}! Did you mean ${speech_error.correction_given}?`, () => {
            listenForYesNo();
          });

          return; // Stop normal execution so it doesn't add to chat history yet
        }
      }

      // Add the conversation to the chat history
      setHistory(prev => [
        ...prev, 
        { role: 'child', text: transcription || "I was talking!" }, 
        { role: 'mochi', text: mochiResponse }
      ]);
      
      setFeedback(mochiResponse);
      if (aiMood) setMood(aiMood);
      
      speakMochi(mochiResponse, () => setIsThinking(false));

    } catch (err) {
      console.error(err);
      setFeedback("Mochi's brain is offline! Check your Python terminal.");
      setIsThinking(false);
    }
  };
  
  const closeCorrection = () => {
    setCorrectionMode('NONE');
    setPendingError(null);
    setFeedback("Let's keep chatting!");
    speakMochi("Great job! You're a star.");

  };
  
  return (
    <div className="h-screen w-full flex bg-[#f0f9ff] overflow-hidden relative">

      <div className={`absolute inset-0 z-40 bg-white/40 backdrop-blur-2x1 transition-all duration-700 ease-in-out ${correctionMode !== 'NONE' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

      {correctionMode === 'NONE' ? (
        <ArrowLeft />
      ):(
        <button
          onClick={closeCorrection}
          className="absolute top-4 left-4 md:top-6 md:left-6 z-[60] flex items-center justify-center w-12 h-12 rounded-full bg-white/70 hover:bg-white text-slate-700 shadow-sm backdrop-blur-md transition-all hover:scale-105"
          title="Go back to chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 -ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/phonetic-dashboard")}
        className="absolute top-4 right-4 z-[60] bg-background/50 backdrop-blur-sm border-border hover:bg-muted"
      >
        View Teacher Dashboard
      </Button>
    
      {/* LEFT SIDE: HISTORY BAR */}
      <div className={`h-full w-[300px] md:w-[350px] flex-shrink-0 z-30 transition-all duration-500 flex flex-col [&>*]:h-full ${correctionMode !== 'NONE' ? 'opacity-20  pointer-events-none' : 'opacity-100'}`}>
        <ChatHistory history={history} scrollRef={scrollRef} />
      </div>

      {/* RIGHT SIDE: MOCHI INTERACTION */}
      <div className="flex-1 h-screen flex flex-col items-center justify-center p-6 relative">

        {/* --- CENTERED CORRECTION CARD --- */}
        {correctionMode === 'SHOWING_CARD' && pendingError && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] animate-in zoom-in-95 duration-500">
            <CorrectionCard 
              userWord={pendingError.user} 
              targetData={pendingError.target}
              onClose={closeCorrection}
            />
          </div>
        )}

        {/* MOCHI AVATAR WRAPPER */}
        <div className={`gap-5 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-50 flex flex-col items-center justify-center
          ${correctionMode === 'SHOWING_CARD' ? 'absolute bottom-4 left-4 md:bottom-10 md:left-10 scale-[0.60] origin-bottom-left' : 'w-full max-w-2xl scale-100'}
          ${correctionMode === 'ASKING_YES_NO' ? '-translate-x-[150px] md:-translate-x-[175px]' : 'translate-x-0'}
        `}>
            <MochiAvatar 
              mood={mood} 
              isThinking={isThinking} 
            />

            {/* Manual Accessibility Buttons*/}
            {correctionMode === 'ASKING_YES_NO' ? (
              <div className="flex flex-col items-center justify-center animate-in slide-in-from-bottom-4 fade-in duration-500 mt-4 w-full text-center">

                <div className="mb-8">
                  <p className="text-2xl text-slate-500 font-semibold mb-2">
                    I heard <span className="text-rose-400 font-bold">"{pendingError?.user}"</span>...
                  </p>

                  <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
                    Did you mean <span className="text-[#fb923c]">"{pendingError?.target.word}"</span>?
                  </h2>

                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => handleYesNoResult(true)}
                    className="bg-[#fb923c] hover:bg-[#f97316] text-white font-bold py-6 px-12 rounded-full text-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
                  >
                    👍 Yes
                  </Button>
                  <Button
                    onClick={() => handleYesNoResult(false)}
                    className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold py-6 px-12 rounded-full text-xl shadow-sm hover:scale-105 transition-all"
                  >
                    👎 No
                  </Button>
                </div>

                {/* Back Button */}
                <Button
                  variant="ghost"
                  onClick={closeCorrection}
                  className="mt-6 text-slate-400 hover:text-slate-600 font-medium"
                >
                  Cancel & Go Back
                </Button>
              </div>

            ) : (

              <div className={`w-full flex flex-col items-center transition-opacity duration-500 ${correctionMode === 'SHOWING_CARD' ? 'opacity-0' : 'opacity-100'}`}>

                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4 text-center">Hello! I'm Mochi</h1>

                <div className="w-full flex justify-center items-start min-h-[4rem]">
                  <FeedbackBubble feedback={feedback} mood={mood} />
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
            )}

        </div>
      </div>
    </div>
  );
}
