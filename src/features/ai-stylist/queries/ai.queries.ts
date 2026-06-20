import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../api/ai.api';

export const aiKeys = {
  all: ['ai'] as const,
  recommendations: () => [...aiKeys.all, 'recommendations'] as const,
  chatSessions: () => [...aiKeys.all, 'chatSessions'] as const,
};

export const useGetOutfitRecommendationMutation = () => {
  return useMutation({
    mutationFn: aiApi.getOutfitRecommendation,
  });
};

export const useCreateChatSessionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aiApi.createChatSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.chatSessions() });
    },
  });
};
