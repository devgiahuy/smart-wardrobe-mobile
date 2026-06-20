import { apiClient } from '@/lib/axios';
import { DailyQuota, SubscriptionPlan, UserSubscription } from '../types';
import { APIResponse } from '@/types/api';

export const subscriptionApi = {
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    const res = await apiClient.get<APIResponse<SubscriptionPlan[]>>('/subscriptions/plans');
    return res.data.data!;
  },

  getMySubscription: async (): Promise<UserSubscription> => {
    const res = await apiClient.get<APIResponse<UserSubscription>>('/subscriptions/me');
    return res.data.data!;
  },

  getDailyQuota: async (): Promise<DailyQuota> => {
    const res = await apiClient.get<APIResponse<DailyQuota>>('/subscriptions/me/daily-quota');
    return res.data.data!;
  },

  toggleAutoRenew: async (autoRenew: boolean): Promise<{ data: boolean; message?: string }> => {
    const res = await apiClient.put<APIResponse<boolean>>('/subscriptions/me/auto-renew', { enabled: autoRenew });
    return { data: res.data.data!, message: res.data.message };
  },
  
  subscribeToPlan: async (planSlug: string): Promise<any> => {
    const res = await apiClient.post<APIResponse<any>>(`/subscriptions/plans/${planSlug}/subscribe`);
    return res.data.data;
  }
};
