# Manual QA Checklist - Smart Wardrobe Mobile

## 1. Authentication
- [ ] Login bằng Email + Password hoạt động
- [ ] Xử lý sai thông tin đăng nhập (hiển thị lỗi hợp lệ)
- [ ] Đăng ký tài khoản (Gửi OTP, xác nhận OTP thành công)
- [ ] Quên mật khẩu (Gửi OTP, nhập OTP, đổi mật khẩu mới)
- [ ] Đăng xuất và điều hướng về trang Login

## 2. Tủ Đồ (Wardrobe)
- [ ] Hiển thị danh sách món đồ (Infinite Scroll hoạt động mượt)
- [ ] Bấm vào xem chi tiết món đồ
- [ ] Upload ảnh mới từ Thư viện
- [ ] Chụp ảnh mới từ Camera
- [ ] Gán metadata (category, color) và phân loại thành công

## 3. Bộ Phối (Outfits)
- [ ] Kéo thả món đồ vào Canvas
- [ ] Pinch-to-zoom (phóng to/thu nhỏ) món đồ trên Canvas
- [ ] Thay đổi thứ tự (Z-index / Bring to front)
- [ ] Lưu Bộ phối (Chụp cover ảnh bằng `react-native-view-shot` và upload Cloudinary)
- [ ] Hiển thị Bộ phối đã lưu trên danh sách

## 4. AI Stylist
- [ ] Chọn thông số từ Modal (Dịp, Phong cách, Mùa) và submit
- [ ] Hiển thị Loading trong quá trình AI gọi
- [ ] Render Recommend Carousel khi AI trả về kết quả
- [ ] SSE chat realtime hoạt động khi nhắn tin với AI
- [ ] Lưu Recommend Outfit vào Tủ Đồ

## 5. Community
- [ ] Hiển thị danh sách bài viết (Outfit & Sale)
- [ ] Like bài viết (số like cập nhật tức thì)
- [ ] Xem chi tiết bài viết (Comment)
- [ ] Gửi bình luận thành công

## 6. Profile, Wallet & Subscription
- [ ] Cập nhật hồ sơ cá nhân
- [ ] Bấm Nạp tiền -> Chọn mệnh giá -> Bật PayOS WebView
- [ ] Xử lý Deep Link khi nạp tiền thành công / thất bại
- [ ] Xem danh sách gói hội viên và đăng ký gói
- [ ] Push Notifications đăng ký thành công khi mở app
