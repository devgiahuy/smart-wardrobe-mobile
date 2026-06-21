import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wardrobeApi } from '../api/wardrobe.api';
import { BatchCropWardrobeItemsReq, CloneWardrobeItemReq, InitClosetFromCatalogReq, UpdateWardrobeItemReq } from '../types';

export const WARDROBE_QUERY_KEYS = {
  all: ['wardrobe'] as const,
  lists: () => [...WARDROBE_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...WARDROBE_QUERY_KEYS.all, 'detail', id] as const,
  categories: ['categories'] as const,
  search: (q: string) => [...WARDROBE_QUERY_KEYS.all, 'search', q] as const,
};

export const useMyWardrobeItems = () => {
  return useQuery({
    queryKey: WARDROBE_QUERY_KEYS.lists(),
    queryFn: async () => {
      try {
        return await wardrobeApi.getMyWardrobeItems();
      } catch (error) {
        console.log("API failed, using MOCK data fallback");
        return [
          {
            id: 'w1',
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400',
            categoryId: 'c1',
            brand: 'H&M',
            color: 'Trắng',
            isFavorite: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'w2',
            imageUrl: 'https://images.unsplash.com/photo-1542272604-780c8e5016b4?auto=format&fit=crop&q=80&w=400',
            categoryId: 'c2',
            brand: 'Zara',
            color: 'Đen',
            isFavorite: false,
            createdAt: new Date().toISOString()
          }
        ];
      }
    },
  });
};

export const useWardrobeItemDetail = (id: string) => {
  return useQuery({
    queryKey: WARDROBE_QUERY_KEYS.detail(id),
    queryFn: () => wardrobeApi.getWardrobeItemDetail(id),
    enabled: !!id,
  });
};

export const useUploadSignature = () => {
  return useQuery({
    queryKey: ['upload-signature'],
    queryFn: () => wardrobeApi.getUploadSignature(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useBatchUploadWardrobeItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BatchCropWardrobeItemsReq) => wardrobeApi.batchUploadWardrobeItems(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.lists() });
    },
  });
};

export const useUpdateWardrobeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWardrobeItemReq }) =>
      wardrobeApi.updateWardrobeItem(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteWardrobeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => wardrobeApi.deleteWardrobeItem(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.lists() });
      queryClient.removeQueries({ queryKey: WARDROBE_QUERY_KEYS.detail(id) });
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: WARDROBE_QUERY_KEYS.categories,
    queryFn: () => wardrobeApi.getCategories(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useSearchWardrobeItems = (query: string) => {
  return useQuery({
    queryKey: WARDROBE_QUERY_KEYS.search(query),
    queryFn: () => wardrobeApi.searchWardrobeItems(query),
    enabled: !!query,
  });
};
