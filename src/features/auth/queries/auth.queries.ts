import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApi.login,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};

export const useConfirmRegisterOtpMutation = () => {
  return useMutation({
    mutationFn: authApi.confirmRegisterOtp,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
};

export const useConfirmForgotPasswordOtpMutation = () => {
  return useMutation({
    mutationFn: authApi.confirmForgotPasswordOtp,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
};

export const useGetMe = (enabled = true) => {
  return useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};
