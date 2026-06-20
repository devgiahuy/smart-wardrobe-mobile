import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Create a query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data remains fresh for 1 minute
      staleTime: 1000 * 60,
      // Cache data for 24 hours offline
      gcTime: 1000 * 60 * 60 * 24,
      retry: 2,
    },
  },
});

// 2. Create the async storage persister
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  // Cache size limit: ~20MB
  throttleTime: 1000,
});
