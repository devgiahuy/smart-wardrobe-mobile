export interface WardrobeItemRes {
  id: string;
  imageUrl: string;
  categoryId: string;
  color?: string;
  brand?: string;
  size?: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface UploadSignatureResult {
  signature: string;
  timestamp: number;
  folder: string;
  cloudName: string;
  apiKey: string;
}

export interface BatchCropWardrobeItemsReq {
  imageUrls: string[];
}

export interface InitClosetFromCatalogReq {
  catalogIds: string[];
}

export interface SearchWardrobeItemRes extends WardrobeItemRes {
  matchScore?: number;
}

export interface UpdateWardrobeItemReq {
  categoryId?: string;
  color?: string;
  brand?: string;
  size?: string;
  isFavorite?: boolean;
}

export interface CategoryRes {
  id: string;
  name: string;
  icon?: string;
}

export interface CloneWardrobeItemReq {
  quantity: number;
}
