import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '../api/community.api';
import { AddCommentReq, LikePostReq, CreatePostReq } from '../types';

export const communityKeys = {
  all: ['community'] as const,
  posts: () => [...communityKeys.all, 'posts'] as const,
  post: (id: string) => [...communityKeys.posts(), id] as const,
  comments: (postId: string) => [...communityKeys.post(postId), 'comments'] as const,
};

export const useGetCommunityPosts = (filters?: { sort?: string; username?: string; postType?: string }, limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: [...communityKeys.posts(), filters],
    queryFn: ({ pageParam = 1 }) => communityApi.getCommunityPosts({ ...filters, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 2, // 2 mins
  });
};

export const useGetPostDetails = (publicId: string) => {
  return useQuery({
    queryKey: communityKeys.post(publicId),
    queryFn: () => communityApi.getPostDetails(publicId),
    enabled: !!publicId,
  });
};

export const useGetPostComments = (publicId: string) => {
  return useQuery({
    queryKey: communityKeys.comments(publicId),
    queryFn: () => communityApi.getPostComments(publicId),
    enabled: !!publicId,
  });
};

export const useLikePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ publicId, data }: { publicId: string; data: LikePostReq }) =>
      communityApi.likePost(publicId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.post(variables.publicId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.posts() });
    },
  });
};

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ publicId, data }: { publicId: string; data: AddCommentReq }) =>
      communityApi.addComment(publicId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(variables.publicId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.post(variables.publicId) });
    },
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: communityApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.posts() });
    },
  });
};
