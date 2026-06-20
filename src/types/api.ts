export interface PaginationMetadata {
  limit: number;
  page: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationResult<T> {
  items: T[];
  metadata: PaginationMetadata;
}

export interface APIResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}
