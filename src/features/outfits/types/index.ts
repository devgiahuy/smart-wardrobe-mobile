import { WardrobeItemRes } from '../../wardrobe/types';

export interface SaveOutfitItemReq {
  wardrobeItemId: string;
  positionX: number;
  positionY: number;
  scale: number;
  layerOrder: number;
  rotation?: number; // adding rotation because our canvas POC has it
}

export interface SaveOutfitReq {
  name: string;
  description?: string;
  coverImageUrl?: string;
  coverPublicId?: string;
  items: SaveOutfitItemReq[];
}

export interface OutfitItemRes {
  id: string;
  wardrobeItem?: WardrobeItemRes;
  positionX: number;
  positionY: number;
  scale: number;
  layerOrder: number;
  rotation?: number;
}

export interface OutfitRes {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  coverPublicId?: string;
  status: number;
  items?: OutfitItemRes[];
  createdAt: string;
  updatedAt: string;
}
