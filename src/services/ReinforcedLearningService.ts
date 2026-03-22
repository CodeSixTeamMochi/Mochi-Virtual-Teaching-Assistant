import axios from 'axios';

export interface MochiResponse {
    transcription: string;
    mochiResponse: string;
    mood?: 'HAPPY' | 'CELEBRATING' | 'ENCOURAGING' | 'THINKING';

    speech_error?: {
    error_type: string;
    detected_speech: string;
    correction_given: string;
  } | null;
}

export interface ChatMessage {
    role: 'child' | 'mochi';
    text: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const chatWithMochi = async (audioBlob: Blob, history: ChatMessage[], activeStudentId: string) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("history", JSON.stringify(history));
    
    formData.append("student_id", activeStudentId);

    const response = await fetch('http://localhost:5000/api/chat-with-mochi', {
        method: 'POST',
        body: formData,
    });
    
    return response.json();
};


