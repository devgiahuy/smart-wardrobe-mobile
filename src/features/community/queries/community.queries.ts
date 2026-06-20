import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '../api/community.api';
import { LikePostReq } from '../types';

export const communityKeys = {
  all: ['community'] as const,
  posts: () => [...communityKeys.all, 'posts'] as const,
  postList: (filters: any) => [...communityKeys.posts(), { filters }] as const,
  postDetails: (id: string) => [...communityKeys.posts(), id] as const,
};

export const useGetCommunityPosts = (filters?: {
  sort?: string;
  limit?: number;
  username?: string;
  postType?: string;
}) => {
  return useInfiniteQuery({
    queryKey: communityKeys.postList(filters),
    queryFn: ({ pageParam = 1 }) =>
      communityApi.getCommunityPosts({
        ...filters,
        page: pageParam,
        limit: filters?.limit || 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (lastPage.metadata.page < lastPage.metadata.totalPages) {
        return lastPage.metadata.page + 1;
      }
      return undefined;
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postPublicID, data }: { postPublicID: string; data: LikePostReq }) =>
      communityApi.likePost(postPublicID, data),
    onSuccess: (_: any, variables: any) => {
      // Invalidate posts list and specific post details
      queryClient.invalidateQueries({ queryKey: communityKeys.posts() });
    },
  });
};
