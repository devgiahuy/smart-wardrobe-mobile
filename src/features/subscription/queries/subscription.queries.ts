import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscription.api';

export const subscriptionKeys = {
  all: ['subscription'] as const,
  plans: () => [...subscriptionKeys.all, 'plans'] as const,
  my: () => [...subscriptionKeys.all, 'my'] as const,
  quota: () => [...subscriptionKeys.all, 'quota'] as const,
};

export const useGetSubscriptionPlans = () => {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: subscriptionApi.getSubscriptionPlans,
  });
};

export const useGetMySubscription = () => {
  return useQuery({
    queryKey: subscriptionKeys.my(),
    queryFn: subscriptionApi.getMySubscription,
  });
};

export const useGetDailyQuota = () => {
  return useQuery({
    queryKey: subscriptionKeys.quota(),
    queryFn: subscriptionApi.getDailyQuota,
  });
};

export const useToggleAutoRenewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.toggleAutoRenew,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.my() });
    },
  });
};

export const useSubscribeToPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.subscribeToPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.my() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.quota() });
    },
  });
};
