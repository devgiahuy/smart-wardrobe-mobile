import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { outfitsApi } from '../api/outfits.api';

export const outfitsKeys = {
  all: ['outfits'] as const,
  lists: () => [...outfitsKeys.all, 'list'] as const,
  list: (filters: string) => [...outfitsKeys.lists(), { filters }] as const,
  details: () => [...outfitsKeys.all, 'detail'] as const,
  detail: (id: string) => [...outfitsKeys.details(), id] as const,
};

export const useGetMyOutfits = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: outfitsKeys.list('all'),
    queryFn: ({ pageParam = 1 }) => outfitsApi.getMyOutfits({ page: pageParam, limit }),
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

export const useGetOutfitDetail = (id: string) => {
  return useQuery({
    queryKey: outfitsKeys.detail(id),
    queryFn: () => outfitsApi.getOutfitDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateOutfitMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: outfitsApi.createOutfit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: outfitsKeys.lists() });
    },
  });
};

export const useUpdateOutfitMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof outfitsApi.updateOutfit>[1] }) =>
      outfitsApi.updateOutfit(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: outfitsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: outfitsKeys.lists() });
    },
  });
};

export const useDeleteOutfitMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: outfitsApi.deleteOutfit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: outfitsKeys.lists() });
    },
  });
};
