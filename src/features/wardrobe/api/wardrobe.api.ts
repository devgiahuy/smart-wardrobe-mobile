import { apiClient } from '@/lib/axios';
import { APIResponse, PaginationResult } from '@/types/api';
import {
  WardrobeItemRes,
  UploadSignatureResult,
  BatchCropWardrobeItemsReq,
  CloneWardrobeItemReq,
  SearchWardrobeItemRes,
  UpdateWardrobeItemReq,
  CategoryRes,
} from '../types';

export const wardrobeApi = {
  getMyWardrobeItems: async (params?: { page?: number; limit?: number; category_slug?: string }): Promise<PaginationResult<WardrobeItemRes>> => {
    const res = await apiClient.get<APIResponse<PaginationResult<WardrobeItemRes>>>('/me/wardrobe-items', { params });
    return res.data.data!;
  },

  getUploadSignature: async (): Promise<UploadSignatureResult> => {
    const res = await apiClient.get<APIResponse<UploadSignatureResult>>('/wardrobe-items/upload-signature');
    return res.data.data!;
  },

  batchUploadWardrobeItems: async (data: BatchCropWardrobeItemsReq): Promise<WardrobeItemRes[] & { message?: string }> => {
    const res = await apiClient.post<APIResponse<WardrobeItemRes[]>>('/wardrobe-items/batch-upload', data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },

  getWardrobeItemDetail: async (id: string): Promise<WardrobeItemRes> => {
    const res = await apiClient.get<APIResponse<WardrobeItemRes>>(`/wardrobe-items/${id}`);
    return res.data.data!;
  },

  cloneWardrobeItem: async (id: string, data: CloneWardrobeItemReq): Promise<WardrobeItemRes[] & { message?: string }> => {
    const res = await apiClient.post<APIResponse<WardrobeItemRes[]>>(`/wardrobe-items/${id}/clone`, data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },

  updateWardrobeItem: async (id: string, data: UpdateWardrobeItemReq): Promise<WardrobeItemRes & { message?: string }> => {
    const res = await apiClient.put<APIResponse<WardrobeItemRes>>(`/wardrobe-items/${id}/manual-classify`, data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },

  deleteWardrobeItem: async (id: string): Promise<{ message?: string }> => {
    const res = await apiClient.delete<APIResponse<void>>(`/wardrobe-items/${id}`);
    return { message: res.data.message };
  },

  getCategories: async (): Promise<CategoryRes[]> => {
    const res = await apiClient.get<APIResponse<CategoryRes[]>>('/categories');
    return res.data.data!;
  },

  searchWardrobeItems: async (params?: { q?: string; page?: number; limit?: number; category_slug?: string }): Promise<PaginationResult<SearchWardrobeItemRes>> => {
    const res = await apiClient.get<APIResponse<PaginationResult<SearchWardrobeItemRes>>>('/wardrobe-items/search', {
      params,
    });
    return res.data.data!;
  },
};
