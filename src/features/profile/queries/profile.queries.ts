import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import { UpdateProfileReq } from '../types';
import { useAuthStore } from '@/store/useAuthStore';

export const useUpdateProfileMutation = () => {
  const { login } = useAuthStore();
  
  return useMutation({
    mutationFn: (data: UpdateProfileReq) => profileApi.updateProfile(data),
    onSuccess: (data) => {
      // Update global auth store with new user data
      if (data) {
        login(data);
      }
    },
  });
};
