import api from '@/lib/axios';
import { APIResponse } from '@/types/api';
import { LoginReq, AuthTokens, UserRes } from '../types';

export const authApi = {
  login: async (data: LoginReq): Promise<AuthTokens> => {
    const res = await api.post<APIResponse<AuthTokens>>('/auth/login', data);
    return res.data.data!;
  },

  getMe: async (): Promise<UserRes> => {
    const res = await api.get<APIResponse<UserRes>>('/me');
    return res.data.data!;
  },
};
