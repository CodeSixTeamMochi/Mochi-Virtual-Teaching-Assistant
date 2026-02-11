import axios from 'axios';

export interface MochiResponse {
    transcription: string
    mochiResponse: string
}

export interface ChatMessage {
    role: 'child' | 'mochi';
    text: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const chatWithMochi = async (audioBlob: Blob, history: ChatMessage[]): Promise<MochiResponse> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('history', JSON.stringify(history));

    try {
        const response = await axios.post(`${API_BASE_URL}/chat-with-mochi`, formData);
        return response.data;

    } catch(error){
        console.error("Error calling Mochi API:", error);
        throw error;
    }
};


