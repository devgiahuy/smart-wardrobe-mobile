# Mobile Migration Analysis & Plan - Expo SDK 56 Architecture (Bản Chi Tiết)

## 1. Executive Summary
Tài liệu này là bản phân tích chuyên sâu source code Frontend Web `smart-wardrobe-fe` (Next.js 16) để xây dựng ứng dụng Mobile `smart-wardrobe-mobile` (Expo SDK 56 & React Native).
- **Mục tiêu cốt lõi**: Tái sử dụng tối đa logic nghiệp vụ (API, Zod Validation, Zustand Store, TanStack Query hooks). Thay thế hoàn toàn lớp View (HTML/CSS/Tailwind) bằng Native UI (React Native/NativeWind) và tích hợp các tính năng native của thiết bị.

---

## 2. Route Mapping & Trúc Cấu Màn Hình Chi Tiết
Dựa trên phân tích thư mục `src/app` của Next.js, kiến trúc điều hướng bằng **Expo Router** sẽ được xây dựng chính xác như sau:

| Web Route (Next.js) | App Flow | Mobile Expo Route | Loại UI Điều Hướng |
| --- | --- | --- | --- |
| `/(guest)/auth/login` | Guest (Auth) | `/auth/login` | Stack Screen |
| `/(guest)/auth/register` | Guest (Auth) | `/auth/register` | Stack Screen |
| `/(guest)/auth/register/preferences` | Guest (Auth) | `/auth/preferences` | Stack Screen |
| `/(user)/dashboard` | Core (User) | `/(tabs)/index` | Bottom Tab |
| `/(user)/wardrobe` | Core (User) | `/(tabs)/wardrobe/index` | Bottom Tab |
| `/(user)/wardrobe/upload` | Wardrobe | `/(tabs)/wardrobe/upload` | Modal / Stack Screen |
| `/(user)/wardrobe/item/[id]` | Wardrobe | `/(tabs)/wardrobe/item/[id]` | Stack Screen |
| `/(user)/wardrobe/item/[id]/edit` | Wardrobe | `/(tabs)/wardrobe/item/[id]/edit` | Stack Screen |
| `/(user)/wardrobe/item/[id]/sell` | Wardrobe | `/(tabs)/wardrobe/item/[id]/sell` | Stack Screen |
| `/(user)/outfits` | Core (User) | `/(tabs)/outfits/index` | Bottom Tab |
| `/(user)/outfits/create` | Outfits | `/(tabs)/outfits/create` | Stack Screen |
| `/(user)/outfits/[id]` | Outfits | `/(tabs)/outfits/[id]` | Stack Screen |
| `/(user)/ai-stylist` | AI Feature | `/(tabs)/ai-stylist` | Stack Screen |
| `/(user)/community` | Community | `/(tabs)/community` | Bottom Tab (nếu có) / Stack |
| `/(user)/marketplace` | Marketplace | `/marketplace/index` | Stack Screen |
| `/(user)/marketplace/my-listings` | Marketplace | `/marketplace/my-listings` | Stack Screen |
| `/(user)/profile` | Profile | `/(tabs)/profile/index` | Bottom Tab |
| `/(user)/profile/update` | Profile | `/(tabs)/profile/update` | Stack Screen |
| `/(user)/settings/wallet` | Settings | `/settings/wallet` | Stack Screen |
| `/(user)/pricing` | Subscription | `/pricing` | Stack Screen |
| `/admin/*` | Admin | KHÔNG BUILD | Chỉ dùng trên Web |

---

## 3. Zustand Store Design & Migration
Trong source Web, file `useAuthStore.ts` sử dụng `zustand` kết hợp với `persist` middleware và `localStorage`.
**Rủi ro nếu không chú ý**: `localStorage` không tồn tại trên React Native.

**Kế hoạch Migrate**:
1. **Thay thế storage adapter**: Sử dụng **React Native MMKV** để làm storage engine thay cho `localStorage`. Tạo một `createJSONStorage` adapter từ MMKV cho Zustand.
2. **Cấu trúc Store**:
   - `auth.store.ts`: Lưu trữ `user`, `isAuthenticated`. (Chuyển đổi dữ liệu mock MOCK_USERS sang API thật nếu có backend).
   - `settings.store.ts`: Có thể tạo thêm để lưu preferences (Dark mode, language).

**Mã mẫu dự kiến cho Mobile Storage**:
```typescript
import { StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
export const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};
```

---

## 4. API & Query Management Chi Tiết
Tái sử dụng trực tiếp các file trong `src/features/**/api/*.api.ts` và `src/features/**/queries/*.queries.ts`.

### Danh sách APIs Đã Phân Tích & Cách Xử Lý:
#### Wardrobe Feature (`wardrobe.api.ts` & `wardrobe.queries.ts`)
- `getMyWardrobeItems`: Gọi bằng `useQuery` để lấy list wardrobe.
  - **Mobile UI**: Sử dụng `FlashList`, kết hợp prop `refreshing` và `onRefresh` với `query.refetch()`.
- `getWardrobeItemDetail`: `useQuery` chi tiết.
- `deleteWardrobeItem` & `bulkDeleteWardrobeItems`: Gọi `useMutation`, sau đó dùng `queryClient.invalidateQueries({ queryKey: ['wardrobe'] })`.
- `batchUploadWardrobeItems`: 
  - **Sự khác biệt trên Mobile**: Không dùng standard `<input type="file" />`. Phải sử dụng **Expo Image Picker** hoặc **Expo Camera** để lấy URI của ảnh, sau đó tạo `FormData` và post lên server, HOẶC upload qua Signed URL (`getUploadSignature`).

#### Các Features Khác:
- `outfits.queries.ts`: `useInfiniteQuery` cho danh sách Outfits (có phân trang vô hạn). Ở mobile dùng prop `onEndReached` của FlatList/FlashList để gọi `fetchNextPage()`.
- `wallet.queries.ts`, `subscription.queries.ts`, `billing.queries.ts`, `community.queries.ts`, `profile.queries.ts`: Tái sử dụng hoàn toàn logic query.

---

## 5. Form & Validation Design
- Source Web đang sử dụng `react-hook-form` + `@hookform/resolvers/zod` + `zod`.
- **Hành động**: Tái sử dụng 100% schema Zod (ví dụ: `loginSchema`, `uploadItemSchema`).
- **Thay đổi UI**: 
  - Đổi các input component như `<input>`, `<textarea>`, `<Select>` thành `<TextInput>`, Bottom Sheets, hoặc Picker Native.
  - Bọc tất cả Custom Inputs bằng thẻ `<Controller>` từ `react-hook-form` để quản lý state form chuẩn xác.

---

## 6. Native Features Mapping (Rất Quan Trọng)
Các màn hình sẽ thay đổi hoàn toàn cách tương tác khi lên Mobile:

1. **Màn hình Thêm đồ vào Tủ (Wardrobe Upload)**
   - Không chọn file từ máy tính.
   - **Tích hợp**: `expo-camera` để người dùng chụp ảnh sản phẩm ngay lập tức, và `expo-image-picker` để lấy từ thư viện ảnh điện thoại.
   - **Tích hợp crop**: Cần sử dụng thư viện như `expo-image-manipulator` để crop và nén ảnh (giảm dung lượng trước khi upload).

2. **Giao diện Mở Rộng (Modals & Dropdowns)**
   - Đổi toàn bộ các component Dialog/DropdownMenu (shadcn/radix) sang `@gorhom/bottom-sheet` để mang lại trải nghiệm chuẩn UX mobile.

3. **Hình ảnh tải lên và Hiển thị (Images)**
   - Hệ thống Web dùng thẻ `<img />` hoặc `<Image>` của Next.js.
   - Trên Mobile bắt buộc dùng **`expo-image`** để có cơ chế Caching (Disk/Memory), tránh lag và crash app khi render hàng trăm cái áo/quần trong `FlashList`.

4. **Kéo thả để Mix & Match Outfit**
   - Web có thể dùng HTML5 Drag/Drop hoặc thư viện Dnd-kit.
   - Mobile: Phải sử dụng `react-native-gesture-handler` kết hợp `react-native-reanimated` để xử lý PanGesture mượt mà.

---

## 7. Kiến Trúc Thư Mục Chuẩn Cho Mobile App
```text
smart-wardrobe-mobile/
├── src/
│   ├── app/                      # Expo Router Tree (app/, app/(tabs), app/(auth))
│   ├── features/                 # Copy 1:1 Business Logic từ Web
│   │   ├── auth/                 # (api, hooks, schemas, types)
│   │   ├── wardrobe/
│   │   ├── outfits/
│   │   ├── profile/
│   ├── components/
│   │   ├── ui/                   # Các component Native/NativeWind (Button, Input, BottomSheet)
│   │   ├── forms/                # Form logic kết hợp react-hook-form
│   ├── lib/                      # Cấu hình Axios (api.ts), TanStack Query (queryClient.ts)
│   ├── store/                    # Zustand stores (setup với MMKV)
│   ├── constants/                # Colors, Theme, Layout configurations
│   ├── types/                    # Common types
├── .env                          # Biến môi trường (EXPO_PUBLIC_API_URL)
├── app.json                      # Expo config
└── tailwind.config.js            # NativeWind setup
```

---

## 8. Development Roadmap Chuẩn Xác
- **Phase 1: Foundation (1 tuần)**
  - Khởi tạo app bằng Expo SDK 56.
  - Cài đặt NativeWind, MMKV, Zustand, Axios, TanStack Query.
  - Xây dựng Layout cơ bản: Tabs Navigator và Stack Navigator với Expo Router.
  - Setup UI Kit cơ bản (Button, TextInput, Custom Text).
  
- **Phase 2: Auth & Store (3 ngày)**
  - Copy store Auth từ Web, chuyển `localStorage` thành `MMKV`.
  - Làm màn Login/Register. Ghép API thật và test lưu phiên đăng nhập.

- **Phase 3: Core Wardrobe (1.5 tuần)**
  - Làm UI Grid xem quần áo (`FlashList`, `expo-image`).
  - Làm luồng Upload đồ: Camera + Image Picker.
  - Tái sử dụng file `wardrobe.api.ts` và `wardrobe.queries.ts`.

- **Phase 4: Outfits & AI Stylist (1.5 tuần)**
  - Grid danh sách Outfit.
  - Tính năng Tạo Outfit (Cần code Drag & Drop/Layout riêng cho Mobile).
  - Tái sử dụng `outfits.queries.ts`.
  - Màn hình AI Chat/Stylist.

- **Phase 5: Marketplace, Community & Profile (1 tuần)**
  - Xây dựng các UI màn hình còn lại.
  - Bổ sung Bottom Sheet cho phần Settings và Profile updates.

- **Phase 6: Testing & Optimization (1 tuần)**
  - Sửa lỗi hình ảnh bị giật/lag (Tối ưu `expo-image`).
  - Thêm các vi hiệu ứng (Micro-animations) bằng `react-native-reanimated`.
  - Buid TestFlight và cài đặt lên máy vật lý để test Camera/Thư viện ảnh.

---

## 9. Cảnh Báo Lỗi Thường Gặp Cần Tránh Khi Code
1. **Lỗi Biến Môi Trường**: Biến từ Next.js (`NEXT_PUBLIC_...`) phải đổi thành `EXPO_PUBLIC_...`.
2. **Lỗi Giao Diện Not Found**: Khi copy logic từ Web, không bao giờ render trực tiếp các thẻ HTML như `<div>`, `<span>`. Trình biên dịch React Native sẽ báo lỗi đỏ màn hình ngay lập tức.
3. **Lỗi Import Web-only**: Phải check kĩ và xoá hết các import liên quan đến `lucide-react` (đổi thành `lucide-react-native`), xoá import liên quan tới `next/image`, `next/navigation`, `next/router` (thay bằng `expo-router`).
4. **Hiệu năng danh sách**: Khuyến nghị dùng `@shopify/flash-list` thay cho `FlatList` của React Native cho danh sách Wardrobe để tránh bị tụt FPS khi số lượng áo quần lớn.
