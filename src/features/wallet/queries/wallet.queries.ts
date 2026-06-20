import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '../api/wallet.api';
import { WalletTopUpReq } from '../types';

export const walletKeys = {
  all: ['wallet'] as const,
  balance: () => [...walletKeys.all, 'balance'] as const,
  statements: () => [...walletKeys.all, 'statements'] as const,
};

export const useGetWalletBalance = () => {
  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: walletApi.getWalletBalance,
  });
};

export const useGetWalletStatements = () => {
  return useQuery({
    queryKey: walletKeys.statements(),
    queryFn: walletApi.getWalletStatements,
  });
};

export const useCreateTopUpRequestMutation = () => {
  return useMutation({
    mutationFn: (data: WalletTopUpReq) => walletApi.createTopUpRequest(data),
  });
};
