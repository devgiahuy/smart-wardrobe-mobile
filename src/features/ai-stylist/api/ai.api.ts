import { apiClient, API_BASE_URL } from '@/lib/axios';
import { APIResponse } from '@/types/api';
import { secureStorage } from '@/lib/storage';
import EventSource from 'react-native-sse';
import { AIOutfitRecommendationReq, AIOutfitRecommendationRes, CreateChatSessionReq, ChatSessionRes } from '../types';

export const aiApi = {
  getOutfitRecommendation: async (data: AIOutfitRecommendationReq): Promise<AIOutfitRecommendationRes> => {
    // Timeout extended inside axios if needed
    const res = await apiClient.post<APIResponse<AIOutfitRecommendationRes>>('/ai/outfit-recommendations', data);
    return res.data.data!;
  },

  createChatSession: async (data: CreateChatSessionReq): Promise<ChatSessionRes> => {
    const res = await apiClient.post<APIResponse<ChatSessionRes>>('/ai/chat/sessions', data);
    return res.data.data!;
  },

  sendChatMessageStream: async (
    contextID: string,
    message: string,
    onChunk: (text: string) => void,
    onDone: (fullText: string) => void,
    onError: (error: Error) => void
  ) => {
    const token = await secureStorage.getItemAsync('accessToken');
    
    // In React Native, we use react-native-sse
    const es = new EventSource(`${API_BASE_URL}/ai/chat/sessions/${contextID}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: message }),
    });

    es.addEventListener("chunk", (event: any) => {
      if (event.data) {
        let textChunk = '';
        try {
          textChunk = JSON.parse(event.data);
        } catch {
          textChunk = event.data;
        }
        onChunk(textChunk);
      }
    });

    es.addEventListener("done", (event: any) => {
      if (event.data) {
        let fullText = '';
        try {
          fullText = JSON.parse(event.data);
        } catch {
          fullText = event.data;
        }
        onDone(fullText);
      } else {
        onDone('');
      }
      es.close();
    });

    es.addEventListener("error", (event: any) => {
      console.error('SSE Error', event);
      onError(new Error(event.message || 'Stream error'));
      es.close();
    });

    return () => {
      es.close();
    };
  },
};
