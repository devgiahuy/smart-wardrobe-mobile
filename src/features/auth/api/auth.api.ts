import { apiClient } from '@/lib/axios';
import {
  AuthTokenRes,
  ConfirmForgotPasswordOtpReq,
  ConfirmRegisterOtpReq,
  LoginReq,
  RegisterReq,
  ResetPasswordReq,
  SendForgotPasswordOtpReq,
  UserRes,
} from '../types';

export const authApi = {
  login: async (data: LoginReq): Promise<AuthTokenRes> => {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },
  register: async (data: RegisterReq): Promise<void> => {
    await apiClient.post('/auth/register', data);
  },
  confirmRegisterOtp: async (data: ConfirmRegisterOtpReq): Promise<void> => {
    await apiClient.post('/auth/register/confirm-otp', data);
  },
  forgotPassword: async (data: SendForgotPasswordOtpReq): Promise<void> => {
    await apiClient.post('/auth/forgot-password', data);
  },
  confirmForgotPasswordOtp: async (data: ConfirmForgotPasswordOtpReq): Promise<void> => {
    await apiClient.post('/auth/forgot-password/confirm-otp', data);
  },
  resetPassword: async (data: ResetPasswordReq): Promise<void> => {
    await apiClient.post('/auth/reset-password', data);
  },
  getMe: async (): Promise<UserRes> => {
    const res = await apiClient.get('/me');
    return res.data;
  },
  updatePushToken: async (pushToken: string): Promise<void> => {
    await apiClient.post('/me/push-token', { pushToken });
  }
};
