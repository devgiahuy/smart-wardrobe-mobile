# Smart Wardrobe Mobile — Implementation Plan (Chi tiết)

## Tổng quan

Xây dựng ứng dụng di động Smart Wardrobe dựa trên kiến trúc và tính năng của `smart-wardrobe-fe` (Next.js).

**Tech Stack Mobile:**
- **Framework:** Expo SDK 56 + Expo Router (file-based routing)
- **UI:** React Native + NativeWind (TailwindCSS v3) + `lucide-react-native`
- **State:** Zustand (global auth state) + TanStack React Query v5 (server state)
- **HTTP:** Axios (interceptors cho auth)
- **Form:** React Hook Form + Zod v4
- **Animation:** React Native Reanimated v4
- **Storage:** `expo-secure-store` (tokens), `@react-native-async-storage` (non-sensitive cache)
- **Push Notification:** `expo-notifications` + `expo-device`

> [!IMPORTANT]
> **Không hỗ trợ chế độ Offline.** Mọi dữ liệu đều yêu cầu kết nối mạng. Khi mất mạng, hiển thị thông báo retry.

---

## Quyết định đã được phê duyệt

> [!NOTE]
> **✅ Xác thực trên Mobile:** Token sẽ được lưu trong `expo-secure-store` (mã hóa phần cứng). Client tự gắn Bearer token vào mỗi request qua Axios interceptor. Không sử dụng tầng BFF. — **Đã duyệt.**

> [!NOTE]
> **✅ Canvas phối đồ:** Giữ nguyên canvas kéo-thả tự do trên mobile, sử dụng `react-native-gesture-handler` (PanGesture + PinchGesture) kết hợp `react-native-reanimated` để đạt hiệu ứng pinch-to-zoom, drag & drop, scale và layer ordering tương tự FE web. — **Đã duyệt.**

> [!NOTE]
> **✅ Offline:** Hỗ trợ **cache offline read-only** cho Wardrobe, Outfit, và Profile bằng cách cấu hình React Query Persister với storage nội bộ. Các thao tác write (tạo, sửa, xoá) vẫn yêu cầu mạng. — **Đã cập nhật theo yêu cầu.**

> [!NOTE]
> **✅ Push Notification:** Tích hợp push notification cho Community (like/comment) và AI Stylist (phân tích xong) cùng Marketplace và Subscription. — **Đã duyệt.**

---

## Kiến trúc thư mục

```text
smart-wardrobe-mobile/
├── app/                        # Expo Router
│   ├── _layout.tsx             # Root: SafeAreaProvider, QueryProvider, AuthGuard
│   ├── (auth)/                 # Auth group (không cần đăng nhập)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   ├── confirm-otp.tsx
│   │   └── reset-password.tsx
│   ├── (tabs)/                 # Main app (Bottom Tab Navigator)
│   │   ├── _layout.tsx         # Tab bar layout (4 tabs)
│   │   ├── wardrobe/
│   │   │   ├── index.tsx       # Danh sách tủ đồ
│   │   │   ├── [id].tsx        # Chi tiết trang phục
│   │   │   ├── upload.tsx      # Upload trang phục
│   │   │   └── edit/[id].tsx   # Chỉnh sửa phân loại thủ công
│   │   ├── ai-stylist/
│   │   │   └── index.tsx       # AI Stylist chat + recommendation
│   │   ├── community/
│   │   │   └── index.tsx       # Social feed
│   │   └── profile/
│   │       └── index.tsx       # Hồ sơ cá nhân
│   ├── outfits/
│   │   ├── index.tsx           # Danh sách bộ phối đồ
│   │   ├── [id].tsx            # Chi tiết bộ phối
│   │   └── create.tsx          # Tạo bộ phối (canvas)
│   ├── marketplace/
│   │   ├── index.tsx           # Danh sách trao đổi
│   │   └── my-listings.tsx     # Quản lý đăng bán của tôi
│   ├── pricing.tsx             # Gói hội viên Premium
│   ├── settings/
│   │   ├── index.tsx           # Cài đặt chung
│   │   ├── wallet.tsx          # Ví nội bộ
│   │   └── edit-profile.tsx    # Chỉnh sửa hồ sơ
│   └── post/
│       ├── [publicId].tsx      # Chi tiết bài đăng cộng đồng
│       └── create.tsx          # Tạo bài đăng
├── src/
│   ├── components/
│   │   ├── ui/                 # Button, Input, Modal, Avatar, Badge, Toast
│   │   └── layout/            # TabBar custom, Header
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/auth.api.ts
│   │   │   ├── queries/auth.queries.ts
│   │   │   ├── types/index.ts
│   │   │   └── components/     # LoginForm, RegisterForm, OtpInput
│   │   ├── wardrobe/
│   │   │   ├── api/wardrobe.api.ts
│   │   │   ├── queries/wardrobe.queries.ts
│   │   │   ├── types/index.ts
│   │   │   ├── utils.ts
│   │   │   └── components/     # WardrobeCard, WardrobeItemDetail, CategoryFilter
│   │   ├── outfits/
│   │   │   ├── api/outfits.api.ts
│   │   │   ├── queries/outfits.queries.ts
│   │   │   ├── types/index.ts
│   │   │   └── components/     # OutfitCard, OutfitCanvas
│   │   ├── ai-stylist/
│   │   │   ├── api/ai.api.ts
│   │   │   ├── queries/ai.queries.ts
│   │   │   ├── types/index.ts
│   │   │   └── components/     # ChatBubble, RecommendationCard, ParamSelector
│   │   ├── community/
│   │   │   ├── api/community.api.ts
│   │   │   ├── queries/community.queries.ts
│   │   │   ├── types/index.ts
│   │   │   └── components/     # PostCard, CommentSheet, CreatePostSheet
│   │   ├── profile/
│   │   │   ├── api/profile.api.ts
│   │   │   ├── queries/profile.queries.ts
│   │   │   ├── types/index.ts
│   │   │   └── components/     # ProfileHeader, BodyProfileForm
│   │   ├── subscription/
│   │   │   ├── api/subscription.api.ts
│   │   │   ├── queries/subscription.queries.ts
│   │   │   └── components/     # PricingCard, CurrentPlanCard
│   │   ├── billing/
│   │   │   ├── api/billing.api.ts
│   │   │   ├── queries/billing.queries.ts
│   │   │   └── components/     # WalletBalanceWidget, TransactionHistory
│   │   └── notification/
│   │       ├── api/notification.api.ts
│   │       └── hooks/usePushNotification.ts
│   ├── lib/
│   │   ├── axios.ts            # Axios instance + interceptors
│   │   ├── storage.ts          # expo-secure-store wrapper
│   │   ├── cloudinary.ts       # Upload helper + background removal URL
│   │   ├── sentry.ts           # Cấu hình Sentry (Error tracking + Performance monitoring)
│   │   ├── analytics.ts        # Custom analytics logger
│   │   └── utils.ts            # cn(), twMerge
│   ├── constants/
│   │   ├── colors.ts
│   │   └── config.ts           # API_BASE_URL, CLOUDINARY config
│   └── store/
│       └── useAuthStore.ts     # Zustand: user, isAuthenticated, login, logout
```

---

## Luồng gọi API (Khác biệt so với FE)

| Tiêu chí | FE (Next.js) | Mobile (Expo) |
|---|---|---|
| **Token storage** | HttpOnly Cookie (BFF set) | `expo-secure-store` (client set) |
| **Token attachment** | `middleware.ts` rewrite + header injection | Axios Request Interceptor tự gắn Bearer |
| **Refresh token** | BFF route `/api/auth/refresh-token` | Client gọi thẳng BE `/api/v1/auth/refresh-token` |
| **API Base URL** | `/api/v1` (proxy qua Next.js) | `https://api.yourbackend.com/api/v1` (trực tiếp) |
| **SSR/Initial data** | `serverFetch` + `initialData` prop | Dùng React Query Persister để lưu cache offline read-only cho Wardrobe, Outfit, Profile. |

### Axios Interceptor (`src/lib/axios.ts`)
1. **Request Interceptor:** Đọc `accessToken` từ `expo-secure-store` → gắn `Authorization: Bearer <token>`.
2. **Response Interceptor:** Nếu nhận `401`:
   - Đọc `refreshToken` từ secure store.
   - Gọi `POST /api/v1/auth/refresh-token` với body `{ refreshToken }`.
   - Lưu token mới → retry request gốc.
   - Nếu refresh thất bại → xoá store → redirect về `(auth)/login`.

---

## Push Notification

### Thiết lập
- Sử dụng `expo-notifications` + `expo-device`.
- Khi user đăng nhập thành công, gọi `registerForPushNotificationsAsync()` để lấy Expo Push Token.
- Gửi push token về BE qua API (ví dụ `POST /api/v1/me/push-token`) để BE lưu và sử dụng khi cần gửi notification.

### Các kịch bản Push Notification

| Kịch bản | Trigger | Nội dung thông báo |
|---|---|---|
| **Community: Có người like bài** | BE xử lý `PUT /posts/{id}/like` | "Nguyễn Văn A đã thích bài đăng của bạn" |
| **Community: Có comment mới** | BE xử lý `POST /posts/{id}/comments` | "Nguyễn Văn A đã bình luận bài đăng..." |
| **Marketplace: Có người xin mua** | BE xử lý `POST /transfers/requests` | "Có yêu cầu mua món đồ X" |
| **Marketplace: Bàn giao được chấp nhận** | BE xử lý `POST /transfers/accept` | "Bạn đã nhận được món đồ X" |
| **AI Stylist: Phân tích xong** | BE xử lý batch-upload hoàn tất | "AI đã phân tích xong 3 trang phục mới" |
| **Subscription: Hết hạn sắp tới** | BE cron job | "Gói Premium sắp hết hạn trong 3 ngày" |

### Xử lý khi nhận thông báo
- **Foreground:** Hiển thị toast in-app notification.
- **Background/Killed:** Khi user tap → Deep link tới màn hình tương ứng qua Expo Router.

---

## Đặc tả từng màn hình (Chi tiết)

---

### Phase 1: Auth, Core Infrastructure & POC Canvas

> **Mục tiêu tuần 1:** Hoàn thiện hạ tầng cơ bản và kiểm chứng (POC) được tính năng khó nhất là Canvas phối đồ.
>
> **Các thiết lập Core Infrastructure:**
> 1. **Sentry & Analytics:** Tích hợp `@sentry/react-native` để tracking lỗi. Viết module `analytics.ts` bọc các sự kiện quan trọng.
> 2. **Global Error Handling:** Tạo `ErrorBoundary` bọc toàn app. Bắt lỗi crash và lỗi API không mong muốn.
> 3. **Deep Link Architecture:** Cấu hình Expo Router linking schemes (`smartwardrobe://`) để chuẩn bị hứng Push Notification.
> 4. **POC Canvas:** Xây dựng màn hình `outfits/create` nháp với gesture kéo thả, zoom để chốt flow sớm nhất.

---

#### 1.1. Màn hình Đăng nhập — `(auth)/login.tsx`

**Mô tả:** Màn hình đầu tiên khi chưa có token. Cho phép user đăng nhập bằng email/username + password.

**UI Elements:**
- Logo app + Tên app "Smart Wardrobe" (centered)
- Input `loginName` (Email hoặc Username) — placeholder: "Email hoặc tên đăng nhập"
- Input `password` (SecureTextEntry) — placeholder: "Mật khẩu"
- Button "Đăng nhập" — full-width, primary color
- Link "Quên mật khẩu?" → navigate `(auth)/forgot-password`
- Link "Chưa có tài khoản? Đăng ký" → navigate `(auth)/register`

**API:** `POST /api/v1/auth/login` → Body: `{ loginName, password }`
**Logic:**
- Thành công → Lưu `accessToken` + `refreshToken` vào `expo-secure-store`.
- Gọi `GET /api/v1/me` để lấy user data → lưu vào Zustand `useAuthStore`.
- Đăng ký Push Token → gửi về BE.
- Redirect sang `(tabs)/wardrobe`.

**Validation (Zod):**
- `loginName`: required, min 3 ký tự.
- `password`: required, min 6 ký tự.

---

#### 1.2. Màn hình Đăng ký — `(auth)/register.tsx`

**Mô tả:** Đăng ký tài khoản mới với thông tin cá nhân cơ bản.

**UI Elements:**
- Input `firstName` + `lastName` (2 cột ngang)
- Input `username`
- Input `email`
- Input `password` + `confirmPassword`
- Picker `gender` (Nam/Nữ/Khác)
- DatePicker `dateOfBirth`
- Input `address`
- Button "Đăng ký" → gọi API sau đó navigate sang `confirm-otp`

**API:** `POST /api/v1/auth/register` → Body: `RegisterReq`
**Sau khi thành công:** Navigate sang `(auth)/confirm-otp` với params `{ email, type: 'register' }`.

---

#### 1.3. Màn hình Xác nhận OTP — `(auth)/confirm-otp.tsx`

**Mô tả:** Nhập mã OTP 6 chữ số được gửi qua email.

**UI Elements:**
- Hiển thị text "Mã OTP đã gửi tới {email}"
- 6 ô input OTP riêng biệt (auto-focus chuyển sang ô tiếp theo)
- Button "Xác nhận"
- Link "Gửi lại mã" (countdown 60 giây)

**API:**
- Nếu `type=register`: `POST /api/v1/auth/register/confirm-otp` → Body: `{ email, otpCode }`
- Nếu `type=forgot`: `POST /api/v1/auth/forgot-password/confirm-otp` → Body: `{ email, otpCode }`

---

#### 1.4. Màn hình Quên mật khẩu — `(auth)/forgot-password.tsx`

**UI Elements:**
- Input `email`
- Button "Gửi mã OTP"

**API:** `POST /api/v1/auth/forgot-password` → Body: `{ email }`
**Thành công:** Navigate sang `confirm-otp` với `{ email, type: 'forgot' }`.

---

#### 1.5. Màn hình Đặt lại mật khẩu — `(auth)/reset-password.tsx`

**UI Elements:**
- Input `newPassword` + `confirmPassword`
- Toggle `logoutAllDevices`
- Button "Đặt lại mật khẩu"

**API:** `POST /api/v1/auth/reset-password`

---

### Phase 2: Wardrobe & Outfits

---

#### 2.1. Tủ đồ — `(tabs)/wardrobe/index.tsx` (Tab chính #1)

**Mô tả:** Hiển thị toàn bộ trang phục cá nhân của user dưới dạng grid ảnh. Hỗ trợ phân trang, lọc theo danh mục, tìm kiếm, sắp xếp, chọn nhiều để xóa.

**UI Elements:**
- **Header:** Tiêu đề "Wardrobe" + số lượng items ("Đang lưu trữ 142 món đồ")
- **Search bar:** Ô tìm kiếm (debounced 500ms) với icon kính lúp
- **Category tabs:** Scrollable horizontal — "Tất cả", "Áo", "Quần", "Váy", "Giày", "Phụ kiện" → mỗi tab gọi API với `categorySlug` tương ứng
- **Sort dropdown:** "Mới nhất", "Cũ nhất", "Theo tên"
- **Grid:** 2 cột, mỗi card hiển thị:
  - Ảnh trang phục (aspect 3:4) — sử dụng `expo-image` cho caching
  - Tên trang phục (auto-generated từ `category.name + color + style`)
  - Subtitle: `material • fit`
  - Badge trạng thái: `Processing` (spinner), `Failed` (đỏ), `Locked` (khóa)
- **Floating Action Button:** "+" → navigate `/wardrobe/upload`
- **Chế độ chọn nhiều:** Toggle "Chọn nhiều" → hiện checkbox trên mỗi card → button "Xóa (N)" xuất hiện
- **Infinite Scroll:** Sử dụng `FlashList` + `useInfiniteQuery` + `onEndReached` → `fetchNextPage()`

**API:**
- `GET /api/v1/me/wardrobe-items?categorySlug=...&page=...&limit=20` (useInfiniteQuery)
- `DELETE /api/v1/wardrobe-items/bulk` — Body: `{ ids: string[] }` (xóa hàng loạt)

**State (React Query keys):**
- `['wardrobe', 'my-items', categorySlug]`

---

#### 2.2. Chi tiết trang phục — `(tabs)/wardrobe/[id].tsx`

**Mô tả:** Hiển thị chi tiết 1 món trang phục, bao gồm ảnh lớn + metadata AI phân tích (chất liệu, phong cách, màu, pattern...). Cho phép chỉnh sửa phân loại thủ công, nhân bản, hoặc thử phân tích lại.

**UI Elements:**
- **Ảnh lớn:** Full-width, pinch-to-zoom (sử dụng `react-native-reanimated`)
- **Metadata cards:** Grid 2 cột hiển thị:
  - Danh mục (`category.name`)
  - Màu sắc (`color` + circle hiển thị `colorHex`)
  - Chất liệu (`material`)
  - Phong cách (`style`)
  - Kiểu dáng (`fit`)
  - Họa tiết (`pattern`)
  - Mùa (`seasonality`)
  - Giá (`price`)
- **Action buttons:**
  - "Phân loại thủ công" → navigate sang `edit/[id]` — API: `PUT /api/v1/wardrobe-items/{id}/manual-classify`
  - "Nhân bản" → Bottom sheet nhập số lượng — API: `POST /api/v1/wardrobe-items/{id}/clone`
  - "Phân tích lại" (nếu status=Failed) — API: `POST /api/v1/wardrobe-items/{id}/retry-analysis`
  - "Đăng bán" → navigate sang `post/create` với item pre-selected

**API:** `GET /api/v1/wardrobe-items/{id}`

---

#### 2.3. Upload trang phục — `(tabs)/wardrobe/upload.tsx`

**Mô tả:** Cho phép user chụp ảnh hoặc chọn từ thư viện (tối đa 5 ảnh), gán danh mục rồi gửi cho AI phân tích.

**UI Elements:**
- **Bước 1 — Chọn danh mục mặc định:** Grid 2 cột button cho mỗi category (Áo, Quần, Váy, Giày, Phụ kiện, Áo khoác, Mũ, Khác)
- **Bước 2 — Chọn ảnh:**
  - Button "Chụp ảnh" → mở Camera (`expo-image-picker` với `launchCameraAsync`)
  - Button "Chọn từ thư viện" → `launchImageLibraryAsync({ allowsMultipleSelection: true, selectionLimit: 5 })`
- **Bước 3 — Preview:**
  - Grid hiển thị các ảnh đã chọn, mỗi ảnh có:
    - Nút X xóa
    - Dropdown đổi category riêng cho từng ảnh
  - Progress bar khi upload (current/total)
  - Overlay "ĐANG TẢI LÊN" / "AI XỬ LÝ" trên từng ảnh
- **Button "Phân tích tất cả"** → kích hoạt luồng upload

**Luồng upload:**
1. Sử dụng `expo-image-manipulator` để nén ảnh (compression, resize width tối đa 1080px) trước khi gửi đi.
2. `GET /api/v1/wardrobe-items/upload-signature` → lấy chữ ký Cloudinary.
3. Upload từng file lên Cloudinary (sequential) với progress tracking.
4. Apply Cloudinary background removal transformation URL.
5. `POST /api/v1/wardrobe-items/batch-upload` — Body: `{ items: [{ categoryId, imagePublicId, imageUrl }] }`
6. Navigate back sang Wardrobe list.

---

#### 2.4. Chỉnh sửa phân loại — `wardrobe/edit/[id].tsx`

**Mô tả:** Form chỉnh sửa thủ công các thuộc tính mà AI phân tích sai.

**UI Elements:**
- Ảnh trang phục ở trên
- Picker `categoryId`
- Input `color`
- Input `material`
- Input `style`
- Input `fit`
- Input `pattern`
- Input `seasonality`
- Input `price` (numeric)
- Button "Lưu thay đổi"

**API:** `PUT /api/v1/wardrobe-items/{id}/manual-classify` — Body: `ManualClassifyReq`

---

#### 2.5. Danh sách bộ phối đồ — `outfits/index.tsx`

**Mô tả:** Hiển thị tất cả outfit đã lưu (cả AI tạo và tự tạo).

**UI Elements:**
- **Header:** "Curations" + số lượng
- **Filter tabs:** "Tất cả", "Tạo bởi AI", "Thủ công", "Đã lưu" (favorite client-side)
- **Sort:** Mới nhất / Cũ nhất
- **Grid 2 cột:** Mỗi OutfitCard hiển thị:
  - Cover image (ảnh chụp canvas)
  - Tên outfit
  - Số lượng items
  - Badge "AI" nếu `status === 1`
  - Nút tim (favorite), nút xóa (swipe-to-delete hoặc long-press)
- **2 CTA buttons:** "Tạo bằng AI" → navigate `/ai-stylist`, "Tạo Bộ Phối" → navigate `/outfits/create`
- **Infinite Scroll**

**API:**
- `GET /api/v1/me/outfits?page=...&limit=20` (useInfiniteQuery)
- `DELETE /api/v1/outfits/{id}`

---

#### 2.6. Chi tiết bộ phối — `outfits/[id].tsx`

**Mô tả:** Xem canvas bộ phối + danh sách các item trong bộ.

**UI Elements:**
- Cover image lớn
- Tên + mô tả
- Danh sách items (scroll ngang): mỗi item hiển thị ảnh thumbnail, tên, vai trò (role)
- Tọa độ canvas (positionX, positionY, scale, layerOrder) — hiển thị visual layout
- Button "Chỉnh sửa" → navigate `/outfits/create?editId={id}`
- Button "Xóa"

**API:** `GET /api/v1/outfits/{id}`

---

#### 2.7. Tạo bộ phối (Canvas kéo-thả) — `outfits/create.tsx`

**Mô tả:** Canvas kéo thả tự do để phối đồ thủ công, tương tự FE web. User chọn items từ tủ đồ, kéo thả lên canvas, pinch-to-zoom/scale, sắp xếp layer order.

**Thư viện sử dụng:**
- `react-native-gesture-handler`: `PanGestureHandler` (kéo thả) + `PinchGestureHandler` (zoom)
- `react-native-reanimated`: `useSharedValue`, `useAnimatedStyle`, `withSpring` cho animation mượt 60fps
- `react-native-view-shot`: Chụp canvas thành ảnh cover (thay thế `html-to-image` trên web)

**UI Elements:**
- **Canvas area** (full-width, aspect ~4:3):
  - Nền sáng, viền nhạt
  - Mỗi item trên canvas là một `Animated.View` bọc `expo-image`:
    - **Kéo thả:** `PanGesture` → cập nhật `translationX`, `translationY` (useSharedValue)
    - **Pinch-to-zoom:** `PinchGesture` → cập nhật `scale` (useSharedValue)
    - **Controls overlay** (hiện khi tap item):
      - Nút zoom in (+) / zoom out (-)
      - Nút "Đưa lên trên" (bring to front — tăng zIndex)
      - Nút xóa khỏi canvas (X)
    - Mỗi item lưu state: `{ id, x, y, scale, zIndex, wardrobeItemId }`
- **Bottom drawer/sheet** — "Chọn trang phục":
  - `ScrollView` ngang hiển thị thumbnail tất cả wardrobe items
  - Tap thumbnail → thêm item vào canvas (vị trí giữa, scale mặc định)
- **Form inputs** (trên cùng hoặc bottom sheet):
  - Input `name` — Tên bộ phối
  - Input `description` — Mô tả
- **Action bar** (bottom fixed):
  - Button "Lưu" → `ViewShot.capture()` → upload cover lên Cloudinary → `POST /api/v1/outfits`
  - Button "Hủy" → discard & go back

**Luồng lưu outfit:**
1. Ẩn tất cả controls overlay.
2. Dùng `react-native-view-shot` chụp canvas → nhận base64/URI.
3. `GET /api/v1/outfits/upload-signature` → lấy chữ ký Cloudinary.
4. Upload ảnh cover lên Cloudinary.
5. `POST /api/v1/outfits` — Body: `SaveOutfitReq` gồm `{ name, description, coverImageUrl, items: [{ wardrobeItemId, positionX, positionY, scale, layerOrder }] }`.

**API:**
- `GET /api/v1/me/wardrobe-items` — để chọn items
- `GET /api/v1/outfits/upload-signature` — chữ ký upload cover
- `POST /api/v1/outfits` — Body: `SaveOutfitReq`
- `PUT /api/v1/outfits/{id}` — khi edit

---

### Phase 3: AI Stylist & Community

---

#### 3.1. AI Stylist — `(tabs)/ai-stylist/index.tsx` (Tab chính #2)

**Mô tả:** Giao diện chat + gợi ý outfit từ AI. User chọn thông số (dịp, phong cách, mùa, thời tiết, tông màu) rồi nhận đề xuất outfit từ AI. Sau đó có thể chat tiếp với AI Stylist.

**UI Elements:**
- **Chat header:** Avatar AI + tên "CLOSY AI" + subtitle "Trợ lý phối đồ"
- **Chat area (ScrollView):** Bubble chat 2 phía
  - AI message: bg nhạt, căn trái
  - User message: bg tối, căn phải
  - Loading indicator: 3 dots animation
- **Quick params (Bottom Sheet hoặc Modal):**
  - Chip selector "Dịp": Đi học, Đi làm, Hẹn hò, Tiệc, Thể thao, Ở nhà
  - Chip selector "Phong cách": Minimalist, Casual, Formal, Trendy, Vintage, Streetwear
  - Chip selector "Mùa": Xuân, Hạ, Thu, Đông
  - Chip selector "Thời tiết": Ấm áp, Lạnh, Mưa, Mát mẻ
  - Chip selector "Tông màu": Sáng, Tối, Trung tính, Nhiều màu
  - Button "TẠO NGAY"
- **Input bar:** Ô nhập text + icon slider mở params + nút gửi
- **Khi có kết quả outfit:**
  - Hiển thị recommended items dạng horizontal carousel
  - Mỗi item: ảnh + role (Áo, Quần, Giày...) + nút "Đổi" (swap sang alternative)
  - Button "Lưu vào Tủ đồ" → tạo outfit từ recommendation
  - Button "Tạo lại" → reset

**API:**
- `POST /api/v1/ai/outfit-recommendations` — Body: `RecommendOutfitReq` → Response: items với primary + alternatives
- `POST /api/v1/ai/chat/sessions` — tạo session mới
- `POST /api/v1/ai/chat/sessions/{contextID}/messages/stream` — chat SSE stream
- `GET /api/v1/ai/chat/sessions` — danh sách sessions

**SSE Handling trên Mobile:**
- Sử dụng `react-native-sse` hoặc `EventSource` polyfill vì `fetch` stream chưa ổn định trên RN.
- Accumulate chunks → update message content real-time.

---

#### 3.2. Social Feed — `(tabs)/community/index.tsx` (Tab chính #3)

**Mô tả:** Feed bài đăng cộng đồng, hiển thị theo thời gian. Hỗ trợ infinite scroll, like/unlike, comment, tạo bài mới.

**UI Elements:**
- **Header:** "Community"
- **FAB "Tạo bài đăng"** → mở `post/create`
- **Feed (FlashList):** Mỗi PostCard hiển thị:
  - Avatar + username + thời gian đăng
  - Tiêu đề bài (`title`)
  - Nội dung text (`content`)
  - Media carousel (ảnh/video — horizontal scroll) → dùng `expo-image`
  - Danh sách items đính kèm (nếu là bài đăng bán đồ)
    - Mỗi item: ảnh thumbnail + tên + giá + tình trạng (condition) + trạng thái (available/sold)
  - Thanh action: Nút Like (số lượng) + Nút Comment (số lượng) + Nút Share
  - Badge `postType`: Chia sẻ / Bán / Cho / Trao đổi

**API:**
- `GET /api/v1/posts?page=...&limit=10&postType=...&sort=...` (useInfiniteQuery)
- `PUT /api/v1/posts/{publicId}/like` — Body: `{ isLiked: boolean }`
- `GET /api/v1/posts/{publicId}/comments`
- `POST /api/v1/posts/{publicId}/comments` — Body: `{ content, parentCommentId? }`

**Push Notification:** Nhận thông báo khi bài của mình được like/comment → deep link tới `post/[publicId]`.

---

#### 3.3. Chi tiết bài đăng — `post/[publicId].tsx`

**UI Elements:**
- Full post content (text + media)
- Danh sách items đính kèm (nếu là bài bán đồ): ảnh + tên + giá + button "Xin mua"
- Bình luận (nested comments — cấp 1 + replies)
- Input comment ở bottom
- Nút Like, Share
- Menu actions (sửa/xóa nếu là bài của mình)

**API:**
- `GET /api/v1/posts/{publicId}`
- `GET /api/v1/posts/{publicId}/comments`
- `GET /api/v1/posts/{publicId}/comments/{commentID}/replies`
- `POST /api/v1/transfers/requests` — Body: `{ postItemIds: string[] }` (xin mua)

---

#### 3.4. Tạo bài đăng — `post/create.tsx`

**UI Elements:**
- Input `title`
- TextArea `content`
- Picker `postType` (Chia sẻ, Bán, Cho, Trao đổi)
- Media picker: Chọn tối đa N ảnh → upload Cloudinary
- Nếu postType là Bán/Cho/Trao đổi:
  - "Chọn trang phục từ tủ đồ" → Modal chọn items
  - Mỗi item: input `price` + picker `itemCondition`
- Input `contactInfo`
- Button "Đăng bài"

**API:**
- `GET /api/v1/posts/upload-signature`
- `POST /api/v1/posts` — Body: `CreatePostReq`

---

### Phase 4: Profile, Billing & Settings

---

#### 4.1. Hồ sơ cá nhân — `(tabs)/profile/index.tsx` (Tab chính #4)

**Mô tả:** Hiển thị thông tin user + thống kê + ví thanh toán.

**UI Elements:**
- **Profile header card:**
  - Avatar (dicebear auto-generated hoặc custom avatar)
  - Tên + email
  - Badge "Premium" nếu user có gói cao cấp
  - Badge "12 Outfit" (thống kê)
  - Button "Chỉnh sửa" → navigate `settings/edit-profile`
- **Tab: Tổng quan / Ví thanh toán** (Segmented control)
- **Tab Tổng quan (Premium only):**
  - Style DNA Radar chart (SVG hoặc `react-native-svg`)
  - Sustainability Index (progress bar + grade)
  - Màu sắc thịnh hành (row of color circles)
  - Nếu không Premium: placeholder card "Nâng cấp Premium để xem"
- **Tab Ví thanh toán:** (Component `WalletPageContent`)
  - Số dư hiện tại
  - Nút "Nạp tiền" → gọi API tạo link thanh toán PayOS → mở WebView
  - Lịch sử giao dịch (paginated list)
- **Quick links:** Cài đặt, Gói Premium, Đăng xuất

**API:**
- `GET /api/v1/me` (useProfile)
- `GET /api/v1/subscriptions/me` (thông tin gói cước)
- `GET /api/v1/subscriptions/me/daily-quota`
- `GET /api/v1/subscriptions/me/wallet`
- `GET /api/v1/subscriptions/me/wallet/statements?page=...&limit=10`

---

#### 4.2. Chỉnh sửa hồ sơ — `settings/edit-profile.tsx`

**UI Elements:**
- Avatar + nút đổi ảnh → `expo-image-picker` → upload → `PUT /api/v1/me/avatar`
- Form:
  - Input `firstName`, `lastName`
  - Picker `gender`
  - DatePicker `dateOfBirth`
  - Input `address`
- Section "Hồ sơ cơ thể" (Body Profile):
  - Input `heightCm`, `weightKg`
  - Input `chestCm`, `waistCm`, `hipCm`
  - Picker `bodyShape`
  - Toggle `verifiedByUser`
- Button "Đổi mật khẩu" → form mật khẩu cũ + mới
- Button "Lưu"

**API:**
- `PUT /api/v1/me` — Body: `UpdateProfileReq`
- `PUT /api/v1/me/body-profile` — Body: `UpdateBodyProfileReq`
- `PUT /api/v1/me/avatar` — Body: `{ avatarPublicId, avatarUrl }`
- `PUT /api/v1/me/change-password`

---

#### 4.3. Gói hội viên — `pricing.tsx`

**UI Elements:**
- Hero section: Tiêu đề "Khám phá tiềm năng tủ đồ"
- Card gói hiện tại (nếu có): tên gói, ngày hết hạn, quota AI Chat/Outfit/Items
- Pricing cards: Grid hiển thị các gói (từ API), mỗi card:
  - Tên gói + giá/tháng
  - Danh sách features
  - Badge "Phổ biến" nếu `isPopular`
  - Button "Đăng ký" → mở WebView PayOS thanh toán
- Toggle Auto-renew

**API:**
- `GET /api/v1/subscriptions/plans`
- `GET /api/v1/subscriptions/me`
- `GET /api/v1/subscriptions/me/daily-quota`
- `POST /api/v1/subscriptions/me/purchase` — tạo link thanh toán
- `POST /api/v1/subscriptions/me/purchase-with-wallet`
- `PUT /api/v1/subscriptions/me/auto-renew`

---

#### 4.4. Marketplace — `marketplace/index.tsx`

**Mô tả:** Duyệt các sản phẩm đang được rao bán/cho/trao đổi từ cộng đồng.

**UI Elements:**
- Header "Marketplace"
- Category filter tabs: "Tất cả", "Áo khoác", "Đồ len", "Phụ kiện"
- Button "Đăng bán" → navigate `post/create` với postType=sell
- Grid 2 cột: Mỗi item card:
  - Ảnh sản phẩm (aspect 3:4)
  - Badge tình trạng (Như mới, Ít dùng, Vintage...)
  - Tên + brand
  - Size + Giá
  - Nút Like
- Infinite scroll

**API:** Tái sử dụng `GET /api/v1/posts?postType=sell`

---

#### 4.5. Quản lý đăng bán — `marketplace/my-listings.tsx`

**Mô tả:** Xem các bài đăng bán của mình. Quản lý trạng thái: ai đã xin mua, đánh dấu đã bán, bàn giao.

**UI Elements:**
- Danh sách bài đăng bán (card: ảnh + title + created date)
- Mỗi bài mở ra:
  - Danh sách items + trạng thái (available/pending/sold)
  - Nếu có người xin mua → hiển thị danh sách buyer (avatar + username + thời gian)
  - Button "Đánh dấu đã bán" → chọn buyer
  - Button "Ẩn listing" / "Gỡ món đồ"

**API:**
- `GET /api/v1/transfers/me/posts` — bài đăng bán của tôi
- `GET /api/v1/transfers/items/{postItemID}/requests` — xem ai xin mua
- `POST /api/v1/transfers/mark-sold` — đánh dấu bán
- `GET /api/v1/transfers/me/pending` — đồ đang chờ nhận
- `POST /api/v1/transfers/accept` / `POST /api/v1/transfers/decline`

---

#### 4.6. Ví nội bộ — `settings/wallet.tsx`

**UI Elements:**
- Số dư ví lớn (hiển thị VNĐ)
- Button "Nạp tiền" → input amount → tạo link PayOS → mở WebView thanh toán
- Lịch sử giao dịch (FlatList paginated):
  - Mỗi row: icon + mô tả + số tiền (+/-) + ngày

**API:**
- `GET /api/v1/subscriptions/me/wallet`
- `GET /api/v1/subscriptions/me/wallet/statements?page=...&limit=10`
- `POST /api/v1/subscriptions/me/wallet/topup` — Body: `{ amount, returnUrl, cancelUrl }`

---

## Bottom Tab Bar — 4 tabs

| # | Tab | Icon | Route |
|---|---|---|---|
| 1 | **Wardrobe** | `checkroom` | `(tabs)/wardrobe` |
| 2 | **AI Stylist** | `auto_fix_high` | `(tabs)/ai-stylist` |
| 3 | **Community** | `grid_view` | `(tabs)/community` |
| 4 | **Profile** | `person` | `(tabs)/profile` |

---

## Phase 5: Testing

> Thực hiện sau khi hoàn thành Phase 1–4. Mục tiêu: đảm bảo chất lượng toàn bộ ứng dụng trước khi submit lên App Store / Google Play.

### Tech Stack Testing

| Layer | Tool | Mục đích |
|---|---|---|
| Unit Test | Jest + `@testing-library/react-native` | Test logic, components, hooks |
| Mock API | MSW (Mock Service Worker) | Mock API responses cho unit/integration test |
| E2E Test | Maestro | Test luồng end-to-end trên simulator/device thật |
| Snapshot | Jest snapshot | Phát hiện UI regression |
| Coverage | `jest --coverage` | Đảm bảo coverage tối thiểu 70% |

### Cấu trúc thư mục test

```text
smart-wardrobe-mobile/
├── __tests__/
│   ├── setup.ts                    # Jest setup: mock expo modules, providers
│   ├── utils/
│   │   ├── test-utils.tsx          # Custom render() với providers (QueryClient, Zustand)
│   │   └── msw-handlers.ts        # MSW handlers cho tất cả API endpoints
│   ├── unit/
│   │   ├── store/
│   │   │   └── useAuthStore.test.ts
│   │   ├── lib/
│   │   │   ├── axios.test.ts
│   │   │   ├── storage.test.ts
│   │   │   └── cloudinary.test.ts
│   │   └── features/
│   │       ├── wardrobe/
│   │       │   ├── utils.test.ts
│   │       │   └── wardrobe.queries.test.ts
│   │       ├── outfits/
│   │       │   └── outfits.queries.test.ts
│   │       ├── ai-stylist/
│   │       │   └── ai.queries.test.ts
│   │       ├── community/
│   │       │   └── community.queries.test.ts
│   │       └── subscription/
│   │           └── subscription.queries.test.ts
│   ├── integration/
│   │   ├── auth/
│   │   │   ├── LoginScreen.test.tsx
│   │   │   ├── RegisterScreen.test.tsx
│   │   │   └── OtpScreen.test.tsx
│   │   ├── wardrobe/
│   │   │   ├── WardrobeList.test.tsx
│   │   │   ├── WardrobeDetail.test.tsx
│   │   │   └── UploadFlow.test.tsx
│   │   ├── outfits/
│   │   │   ├── OutfitsList.test.tsx
│   │   │   └── CreateOutfit.test.tsx
│   │   ├── ai-stylist/
│   │   │   └── AIStylistChat.test.tsx
│   │   ├── community/
│   │   │   ├── CommunityFeed.test.tsx
│   │   │   └── CreatePost.test.tsx
│   │   └── profile/
│   │       ├── ProfileScreen.test.tsx
│   │       └── EditProfile.test.tsx
│   └── e2e/
│       ├── auth-flow.yaml           # Maestro flow
│       ├── wardrobe-flow.yaml
│       ├── outfit-creation-flow.yaml
│       ├── ai-stylist-flow.yaml
│       └── community-flow.yaml
```

---

### 5.1. Unit Tests — Store & Lib

#### `useAuthStore.test.ts`
| Test case | Mô tả |
|---|---|
| `login() lưu user + token` | Gọi `login()` → verify state `isAuthenticated=true`, `user` được set |
| `logout() xoá toàn bộ state` | Gọi `logout()` → verify `isAuthenticated=false`, `user=null`, `expo-secure-store` rỗng |
| `hydrate() từ secure store` | Mock `getItemAsync` trả token → verify auto-login khi app khởi động |
| `token hết hạn → reset state` | Simulate refresh token thất bại → verify tự động logout |

#### `axios.test.ts`
| Test case | Mô tả |
|---|---|
| `request interceptor gắn Bearer` | Mock `getItemAsync('accessToken')` → verify header `Authorization: Bearer xxx` |
| `401 → auto refresh → retry` | Mock response 401 → mock refresh thành công → verify request gốc được retry |
| `refresh thất bại → logout` | Mock response 401 + refresh 401 → verify `useAuthStore.logout()` được gọi |
| `concurrent 401 → queue requests` | 3 requests đồng thời bị 401 → verify chỉ 1 lần gọi refresh, 3 requests đều được retry |

#### `storage.test.ts`
| Test case | Mô tả |
|---|---|
| `saveTokens() lưu cả access + refresh` | Verify `setItemAsync` được gọi 2 lần |
| `getTokens() đọc đúng key` | Verify `getItemAsync` với đúng key |
| `clearTokens() xoá hết` | Verify `deleteItemAsync` cho cả 2 key |

#### `cloudinary.test.ts`
| Test case | Mô tả |
|---|---|
| `uploadToCloudinary() gửi đúng params` | Verify FormData chứa đúng file, signature, timestamp, folder |
| `applyCloudinaryBackgroundRemoval() transform URL đúng` | Input URL → verify output chứa `e_background_removal` |

---

### 5.2. Unit Tests — Feature Queries (React Query hooks)

Sử dụng `renderHook()` + `QueryClientProvider` + MSW.

#### Wardrobe queries
| Test case | Mô tả |
|---|---|
| `useMyWardrobe()` trả data đúng | Mock `GET /me/wardrobe-items` → verify data.pages[0].items |
| `useMyWardrobe()` infinite scroll | Gọi `fetchNextPage()` → verify data.pages.length === 2 |
| `useBatchUploadWardrobeItems()` mutation | Mock `POST /wardrobe-items/batch-upload` → verify `onSuccess` invalidate cache |
| `useBulkDeleteWardrobeItems()` mutation | Mock `DELETE /wardrobe-items/bulk` → verify items bị xoá khỏi cache |
| `useCategories()` | Mock `GET /categories` → verify danh sách categories |

#### Outfit queries
| Test case | Mô tả |
|---|---|
| `useMyOutfits()` trả data phân trang | Mock `GET /me/outfits` → verify |
| `useCreateOutfit()` | Mock `POST /outfits` → verify payload đúng (name, coverImageUrl, items với positionX/Y/scale/layerOrder) |
| `useDeleteOutfit()` | Mock `DELETE /outfits/{id}` → verify cache invalidation |

#### AI Stylist queries
| Test case | Mô tả |
|---|---|
| `getOutfitRecommendation()` trả items + alternatives | Mock `POST /ai/outfit-recommendations` → verify response structure |
| `createChatSession()` trả session id | Mock `POST /ai/chat/sessions` → verify |
| SSE stream mock | Simulate chunked SSE → verify message accumulation |

#### Community queries
| Test case | Mô tả |
|---|---|
| `useInfiniteCommunity()` | Mock `GET /posts` → verify pagination |
| `useLikePost()` | Mock `PUT /posts/{id}/like` → verify optimistic update |
| `useCreateComment()` | Mock `POST /posts/{id}/comments` → verify cache update |

#### Subscription queries
| Test case | Mô tả |
|---|---|
| `useSubscriptionPlans()` | Mock `GET /subscriptions/plans` → verify |
| `useMySubscription()` | Mock `GET /subscriptions/me` → verify |
| `useDailyQuota()` | Mock `GET /subscriptions/me/daily-quota` → verify |

---

### 5.3. Integration Tests — Screens

Render toàn bộ screen component trong test environment với mocked API.

#### Auth screens
| Test case | Screen | Mô tả |
|---|---|---|
| Đăng nhập thành công | `LoginScreen` | Nhập email + password → submit → verify navigate sang `(tabs)/wardrobe` |
| Đăng nhập thất bại | `LoginScreen` | Mock 401 → verify hiển thị error toast |
| Validation form | `LoginScreen` | Submit rỗng → verify hiển thị lỗi Zod (required fields) |
| Đăng ký → navigate OTP | `RegisterScreen` | Điền đầy đủ → submit → verify navigate sang `confirm-otp` |
| OTP auto-focus | `OtpScreen` | Nhập 1 số → verify focus chuyển sang ô tiếp theo |
| OTP resend countdown | `OtpScreen` | Verify button "Gửi lại mã" disabled 60 giây |

#### Wardrobe screens
| Test case | Screen | Mô tả |
|---|---|---|
| Render danh sách | `WardrobeList` | Mock API trả 10 items → verify render 10 cards |
| Empty state | `WardrobeList` | Mock API trả [] → verify hiển thị "Tủ đồ trống" |
| Filter by category | `WardrobeList` | Tap "Áo" → verify API được gọi với `categorySlug=ao` |
| Search debounce | `WardrobeList` | Gõ "đen" → verify API gọi sau 500ms |
| Bulk delete | `WardrobeList` | Toggle chọn nhiều → chọn 3 items → xóa → verify API `DELETE /bulk` |
| Item detail render | `WardrobeDetail` | Mock item data → verify hiển thị đủ metadata fields |
| Upload flow | `UploadScreen` | Chọn 3 ảnh + category → submit → verify 3 lần upload Cloudinary + 1 lần batch-upload API |

#### Outfit screens
| Test case | Screen | Mô tả |
|---|---|---|
| Render grid | `OutfitsList` | Mock 5 outfits → verify render 5 cards |
| Filter "Tạo bởi AI" | `OutfitsList` | Tap filter → verify chỉ hiện items với `status=1` |
| Delete confirm dialog | `OutfitsList` | Long-press → confirm xóa → verify API call |
| Canvas add item | `CreateOutfit` | Tap thumbnail → verify item xuất hiện trên canvas |

#### Community screens
| Test case | Screen | Mô tả |
|---|---|---|
| Feed render | `CommunityFeed` | Mock 5 posts → verify render 5 PostCards |
| Like toggle | `CommunityFeed` | Tap like → verify optimistic UI + API call |
| Comment submit | `PostDetail` | Nhập comment → submit → verify xuất hiện trong list |
| Create post | `CreatePost` | Điền title + content + chọn ảnh → submit → verify API call |

#### Profile screens
| Test case | Screen | Mô tả |
|---|---|---|
| Premium badge | `ProfileScreen` | Mock user có subscription → verify badge "Premium" hiển thị |
| Non-premium placeholder | `ProfileScreen` | Mock user free → verify "Nâng cấp Premium" card |
| Edit profile save | `EditProfile` | Sửa firstName → save → verify `PUT /me` gọi đúng |
| Wallet balance | `ProfileScreen` | Tab "Ví" → verify số dư hiển thị đúng |

---

### 5.4. E2E Tests (Maestro)

Sử dụng [Maestro](https://maestro.mobile.dev/) để test luồng end-to-end trên simulator.

#### `auth-flow.yaml`
```yaml
appId: com.smartwardrobe.mobile
---
# Luồng đăng nhập
- tapOn: "Email hoặc tên đăng nhập"
- inputText: "testuser@gmail.com"
- tapOn: "Mật khẩu"
- inputText: "password123"
- tapOn: "Đăng nhập"
- assertVisible: "Wardrobe"
# Luồng đăng xuất
- tapOn: "Profile"
- tapOn: "Đăng xuất"
- assertVisible: "Đăng nhập"
```

#### `wardrobe-flow.yaml`
```yaml
appId: com.smartwardrobe.mobile
---
# Upload trang phục
- tapOn: ".*\\+.*"                    # FAB button
- tapOn: "Áo"                        # Chọn category
- tapOn: "Chọn từ thư viện"
# (Maestro sẽ tự xử lý image picker)
- assertVisible: "Phân tích tất cả"
- tapOn: "Phân tích tất cả"
- assertVisible: "Wardrobe"           # Redirect về list
```

#### `outfit-creation-flow.yaml`
```yaml
appId: com.smartwardrobe.mobile
---
# Tạo outfit thủ công
- tapOn: "Tạo Bộ Phối"
- assertVisible: "Chọn trang phục"
# Thêm items vào canvas
- tapOn:
    index: 0                          # Tap item đầu tiên
- tapOn:
    index: 1                          # Tap item thứ hai
# Nhập tên
- tapOn: "Tên bộ phối"
- inputText: "Summer Casual 2026"
- tapOn: "Lưu"
- assertVisible: "Curations"
```

#### `ai-stylist-flow.yaml`
```yaml
appId: com.smartwardrobe.mobile
---
# Chat với AI Stylist
- tapOn: "AI Stylist"                 # Tab
- assertVisible: "CLOSY AI"
- tapOn: "Nhập yêu cầu phối đồ"
- inputText: "Phối đồ đi làm mùa hè"
- tapOn: ".*send.*"                   # Nút gửi
- waitForAnimationToEnd
- assertVisible: "Lưu vào Tủ đồ"     # Kết quả recommendation
```

#### `community-flow.yaml`
```yaml
appId: com.smartwardrobe.mobile
---
# Tạo bài đăng + Like
- tapOn: "Community"                  # Tab
- tapOn: "Tạo bài đăng"
- tapOn: "Tiêu đề"
- inputText: "Outfit hôm nay"
- tapOn: "Nội dung"
- inputText: "Chia sẻ set đồ đi làm"
- tapOn: "Đăng bài"
- assertVisible: "Outfit hôm nay"     # Bài xuất hiện trong feed
```

---

### 5.5. Manual QA Checklist

Thực hiện trên thiết bị thật (iOS + Android) trước khi release.

#### Thiết bị & OS matrix
| Thiết bị | OS | Ghi chú |
|---|---|---|
| iPhone 14/15 | iOS 17+ | Test chính |
| iPhone SE (3rd gen) | iOS 17+ | Test màn hình nhỏ |
| Samsung Galaxy S23 | Android 14 | Test chính |
| Xiaomi Redmi Note 12 | Android 13 | Test mid-range |

#### Checklist theo feature

**Auth:**
- [ ] Đăng ký → nhận OTP email → xác nhận → đăng nhập thành công
- [ ] Tắt app hoàn toàn → mở lại → tự động đăng nhập (token persist)
- [ ] Token hết hạn → auto refresh → không bị logout
- [ ] Refresh token hết hạn → redirect về login
- [ ] Quên mật khẩu → OTP → đặt lại → đăng nhập bằng mật khẩu mới

**Wardrobe:**
- [ ] Upload 1 ảnh từ Camera → AI phân tích thành công → hiện trong list
- [ ] Upload 5 ảnh từ Gallery → progress bar chạy đúng → tất cả hiện trong list
- [ ] Filter theo "Áo" → chỉ hiện items danh mục Áo
- [ ] Search "đen" → hiện items có màu đen
- [ ] Chọn nhiều → xoá 3 items → confirm dialog → items biến mất
- [ ] Item đang Processing → tap → hiện "đang xử lý"
- [ ] Item bị Locked (vượt quota) → tap → hiện thông báo nâng cấp

**Outfit Canvas:**
- [ ] Thêm 3 items vào canvas → kéo thả di chuyển vị trí
- [ ] Pinch-to-zoom trên 1 item → scale thay đổi
- [ ] Tap "Đưa lên trên" → item lên layer trên cùng
- [ ] Xoá 1 item khỏi canvas → chỉ còn 2
- [ ] Lưu outfit → cover image đúng (chụp canvas, không có controls)
- [ ] Edit outfit đã lưu → load đúng vị trí + scale

**AI Stylist:**
- [ ] Chọn params (dịp + phong cách) → "Tạo ngay" → nhận recommendation
- [ ] Nhập text chat → gửi → nhận response streaming (từng chữ)
- [ ] Tap "Đổi" trên item → swap sang alternative
- [ ] "Lưu vào Tủ đồ" → outfit mới xuất hiện trong danh sách Curations
- [ ] "Tạo lại" → reset toàn bộ conversation

**Community:**
- [ ] Feed load infinite scroll → kéo xuống tải thêm
- [ ] Like bài → số lượng tăng → like lại → số giảm
- [ ] Comment → hiện ngay trong list
- [ ] Reply comment (nested) → hiện đúng cấp
- [ ] Tạo bài bán đồ → chọn items từ tủ đồ → đặt giá → đăng thành công

**Push Notification:**
- [ ] Có người like bài → nhận push notification (app background)
- [ ] Tap notification → mở đúng bài đăng (deep link)
- [ ] Có người comment → nhận push (app killed)
- [ ] AI phân tích xong → nhận push → tap → mở wardrobe
- [ ] Foreground notification → hiện toast in-app (không push native)

**Thanh toán & Subscription:**
- [ ] Xem các gói pricing → tap "Đăng ký" → mở WebView PayOS
- [ ] Thanh toán thành công → quay lại app → gói được cập nhật
- [ ] Nạp tiền ví → WebView PayOS → số dư tăng
- [ ] Lịch sử giao dịch → phân trang đúng

**Performance & Edge cases:**
- [ ] App khởi động cold start < 3 giây
- [ ] Scroll danh sách 100+ items → mượt 60fps (FlashList)
- [ ] Mất mạng → hiện thông báo retry → kết nối lại → tự load
- [ ] Upload ảnh lớn (5MB) → không crash
- [ ] Xoay màn hình (landscape) → UI không vỡ layout
- [ ] Dark mode hệ thống → UI đọc được (nếu hỗ trợ)

---

### 5.6. CI/CD Integration (Khuyến nghị)

```text
Push to main → GitHub Actions:
  1. npm install
  2. npx jest --coverage --ci
     → Fail nếu coverage < 70%
  3. npx maestro test __tests__/e2e/*.yaml
     → Chạy trên Maestro Cloud (iOS + Android simulators)
  4. eas build --profile preview
     → Build preview APK/IPA cho QA team
```

### Lệnh chạy test

```bash
# Unit + Integration tests
npx jest --watchAll

# Coverage report
npx jest --coverage

# Chạy test theo feature
npx jest --testPathPattern="wardrobe"
npx jest --testPathPattern="auth"

# E2E (Maestro)
maestro test __tests__/e2e/auth-flow.yaml
maestro test __tests__/e2e/ # chạy tất cả
```
