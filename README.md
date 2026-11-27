# Web tra cứu tài sản cố định

Web tĩnh (HTML/CSS/JS thuần, không cần build) chạy trên GitHub Pages, dữ liệu lấy từ Google Sheet thông qua Apps Script Web App.

## Các trang

- `index.html` — Tra cứu tài sản theo tên / mã / số thẻ, lọc theo bộ phận và tình trạng.
- `asset.html?id=<Mã tài sản>` — Chi tiết tài sản (trang đích khi quét QR trên tem). Chỉ hiện thông tin cơ bản, **không có nguyên giá**.
- `scan.html` — Quét QR bằng camera điện thoại ngay trong web.
- `labels.html` — Chọn tài sản, tạo và in tem A4 (2 mẫu: Lớn 95×55mm — 10 tem/trang; Vừa 63×40mm — 21 tem/trang), đánh dấu đã in về Google Sheet.
- `settings.html` — Cấu hình URL Apps Script (lưu tại trình duyệt) và thông tin đơn vị / hiển thị công khai (lưu vào Google Sheet, cần PIN quản trị).

## Cấu hình

Dán URL Web App Apps Script vào `config.js` (`API_URL`) trước khi upload, hoặc nhập trong trang Cài đặt trên từng máy.

Xem file `HUONG-DAN-TRIEN-KHAI.md` (đi kèm bộ code) để biết các bước triển khai đầy đủ: tạo Google Sheet → dán Apps Script → deploy Web App → bật GitHub Pages → kiểm thử.
