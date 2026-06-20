import { apiClient } from '@/lib/axios';
import { APIResponse, PaginationResult } from '@/types/api';
import { OutfitRes, SaveOutfitReq } from '../types';

export const outfitsApi = {
  getMyOutfits: async (params?: { page?: number; limit?: number }): Promise<PaginationResult<OutfitRes>> => {
    const res = await apiClient.get<APIResponse<PaginationResult<OutfitRes>>>('/me/outfits', { params });
    return res.data.data!;
  },

  createOutfit: async (data: SaveOutfitReq): Promise<OutfitRes & { message?: string }> => {
    const res = await apiClient.post<APIResponse<OutfitRes>>('/outfits', data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },

  getOutfitDetail: async (id: string): Promise<OutfitRes> => {
    const res = await apiClient.get<APIResponse<OutfitRes>>(`/outfits/${id}`);
    return res.data.data!;
  },

  updateOutfit: async (id: string, data: SaveOutfitReq): Promise<OutfitRes & { message?: string }> => {
    const res = await apiClient.put<APIResponse<OutfitRes>>(`/outfits/${id}`, data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },

  deleteOutfit: async (id: string): Promise<{ message?: string }> => {
    const res = await apiClient.delete<APIResponse<void>>(`/outfits/${id}`);
    return { message: res.data?.message };
  },
};
