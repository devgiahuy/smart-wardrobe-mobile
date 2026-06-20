# Kiến trúc Ứng dụng Di động Smart Wardrobe (Mobile Architecture Plan)

> Tài liệu chi tiết mô tả kiến trúc, luồng xử lý và đặc tả từng màn hình cho Smart Wardrobe Mobile (Expo + React Native).
>
> **Tham chiếu chi tiết đầy đủ:** Xem file `implementation_plan.md` trong Antigravity IDE để xem bản đầy đủ gồm UI Elements, API endpoints, và validation logic cho từng màn hình.

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 56 + Expo Router |
| UI | React Native + NativeWind (TailwindCSS v3) + lucide-react-native |
| State | Zustand (auth) + TanStack React Query v5 (server) |
| HTTP | Axios (interceptors) |
| Form | React Hook Form + Zod v4 |
| Animation | React Native Reanimated v4 |
| Token Storage | expo-secure-store |
| Offline Cache | React Query Persister + MMKV/AsyncStorage |
| Push Notification | expo-notifications + expo-device |
| Image | expo-image, expo-image-picker, expo-image-manipulator (nén ảnh) |
| Tracking & Error | @sentry/react-native + Custom Analytics |

## 2. Cấu trúc thư mục

```text
smart-wardrobe-mobile/
├── app/                        # Expo Router
│   ├── _layout.tsx             # Root: Providers, AuthGuard
│   ├── (auth)/                 # Login, Register, OTP, Forgot/Reset Password
│   ├── (tabs)/                 # Bottom Tab Navigator (4 tabs)
│   │   ├── wardrobe/           # Tủ đồ + Chi tiết + Upload + Edit
│   │   ├── ai-stylist/         # AI Chat + Recommendation
│   │   ├── community/          # Social Feed
│   │   └── profile/            # Hồ sơ cá nhân + Ví + Thống kê
│   ├── outfits/                # Danh sách, Chi tiết, Tạo bộ phối
│   ├── marketplace/            # Mua bán, Quản lý đăng bán
│   ├── pricing.tsx             # Gói hội viên
│   ├── settings/               # Cài đặt, Ví, Chỉnh sửa hồ sơ
│   └── post/                   # Chi tiết bài đăng, Tạo bài
├── src/
│   ├── components/ui/          # Button, Input, Modal, Avatar, Toast, ErrorBoundary
│   ├── features/               # Feature-based: auth, wardrobe, outfits, ai-stylist, community, profile, subscription, billing, notification
│   ├── lib/                    # axios.ts, storage.ts, cloudinary.ts, sentry.ts, analytics.ts, utils.ts
│   ├── constants/              # colors, config (API_BASE_URL)
│   └── store/                  # useAuthStore.ts (Zustand)
```

## 3. Khác biệt API so với FE (Next.js)

| Tiêu chí | FE (Next.js) | Mobile (Expo) |
|---|---|---|
| Token storage | HttpOnly Cookie (BFF) | expo-secure-store |
| Token attachment | middleware.ts rewrite | Axios Request Interceptor |
| Refresh token | BFF route | Client gọi thẳng BE |
| API Base URL | /api/v1 (proxy) | https://api.backend.com/api/v1 (trực tiếp) |
| SSR | serverFetch + initialData | Dùng React Query Persister để lưu cache offline read-only cho Wardrobe, Outfit, Profile |

## 4. Push Notification

Tích hợp push notification cho:
- **Community:** Khi có người like/comment bài đăng.
- **Marketplace:** Khi có người xin mua, bàn giao được chấp nhận.
- **AI Stylist:** Khi AI phân tích xong trang phục.
- **Subscription:** Gói sắp hết hạn.

## 5. Bottom Tab Bar (4 tabs)

| Tab | Icon | Route |
|---|---|---|
| Wardrobe | checkroom | (tabs)/wardrobe |
| AI Stylist | auto_fix_high | (tabs)/ai-stylist |
| Community | grid_view | (tabs)/community |
| Profile | person | (tabs)/profile |

## 6. Tổng số màn hình: ~20+

### Auth (5): Login, Register, OTP, Forgot Password, Reset Password
### Wardrobe (4): List, Detail, Upload, Manual Classify
### Outfits (3): List, Detail, Create/Edit Canvas
### AI Stylist (1): Chat + Recommendation (all-in-one)
### Community (3): Feed, Post Detail, Create Post
### Marketplace (2): Browse, My Listings
### Profile & Settings (4): Profile, Edit Profile, Wallet, Pricing

## 7. Các thành phần hệ thống quan trọng

- **Offline Read-only Cache:** Sử dụng React Query Persister kết hợp với storage nội bộ để lưu trữ tạm thời danh sách Wardrobe, Outfit, và Profile. Cho phép xem nội dung khi không có mạng, các thao tác ghi (tạo, xoá, sửa) vẫn yêu cầu mạng.
- **Image Compression:** Tích hợp `expo-image-manipulator` để nén và thay đổi kích thước ảnh (vd: width max 1080px) trước khi gửi lên Cloudinary, giúp giảm băng thông và tối ưu storage.
- **Sentry & Analytics:** Tích hợp `@sentry/react-native` để theo dõi crash và lỗi API (500). Xây dựng module `analytics.ts` dùng chung.
- **Global Error Handling:** Bọc ứng dụng với `ErrorBoundary` để quản lý các lỗi crash không mong muốn và hiển thị Fallback UI thân thiện.
- **Deep Link Architecture:** Cấu hình scheme `smartwardrobe://` qua Expo Router, kết hợp với Notification Response để điều hướng chính xác vào các màn hình chi tiết (vd: bài viết cộng đồng).
- **POC Canvas (Week 1):** Xây dựng nguyên mẫu màn hình `outfits/create` với gesture kéo thả, zoom ngay trong tuần đầu tiên để kiểm chứng mức độ khả thi của UX.
