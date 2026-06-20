import { apiClient } from '@/lib/axios';
import { APIResponse } from '@/types/api';
import { UserRes, UpdateProfileReq } from '../types';

export const profileApi = {
  getProfile: async (): Promise<UserRes> => {
    const res = await apiClient.get<APIResponse<UserRes>>('/me');
    const responseData = res.data as any;
    if (responseData && responseData.data) {
      return responseData.data;
    }
    return responseData as UserRes;
  },

  updateProfile: async (data: UpdateProfileReq): Promise<UserRes & { message?: string }> => {
    const res = await apiClient.put<APIResponse<UserRes>>('/me', data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },
};
