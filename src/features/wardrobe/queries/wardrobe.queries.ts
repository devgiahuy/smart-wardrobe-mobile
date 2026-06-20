import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wardrobeApi } from '../api/wardrobe.api';

export const wardrobeKeys = {
  all: ['wardrobe'] as const,
  lists: () => [...wardrobeKeys.all, 'list'] as const,
  list: (filters: string) => [...wardrobeKeys.lists(), { filters }] as const,
  details: () => [...wardrobeKeys.all, 'detail'] as const,
  detail: (id: string) => [...wardrobeKeys.details(), id] as const,
  categories: ['categories'] as const,
};

export const useGetMyWardrobeItems = (categorySlug?: string, limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: wardrobeKeys.list(categorySlug || 'all'),
    queryFn: ({ pageParam = 1 }) => wardrobeApi.getMyWardrobeItems({ page: pageParam, limit, category_slug: categorySlug }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetWardrobeItemDetail = (id: string) => {
  return useQuery({
    queryKey: wardrobeKeys.detail(id),
    queryFn: () => wardrobeApi.getWardrobeItemDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: wardrobeKeys.categories,
    queryFn: () => wardrobeApi.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useDeleteWardrobeItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wardrobeApi.deleteWardrobeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.lists() });
    },
  });
};

export const useBatchUploadWardrobeItemsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wardrobeApi.batchUploadWardrobeItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.lists() });
    },
  });
};

export const useUpdateWardrobeItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof wardrobeApi.updateWardrobeItem>[1] }) =>
      wardrobeApi.updateWardrobeItem(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.lists() });
    },
  });
};

export const useCloneWardrobeItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      wardrobeApi.cloneWardrobeItem(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.lists() });
    },
  });
};
