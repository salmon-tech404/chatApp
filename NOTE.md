# ChatApp — Phase 01

> Ứng dụng chat thời gian thực được xây dựng như một dự án thực tập cá nhân, lấy cảm hứng từ các nền tảng nhắn tin hiện đại. Hỗ trợ nhắn tin trực tiếp, chat nhóm, kết bạn, chia sẻ hình ảnh và cập nhật thông tin cá nhân.

---

## Tech Stack

### Frontend

| Công nghệ                  | Vai trò                                      |
| -------------------------- | -------------------------------------------- |
| React 19                   | Thư viện UI chính                            |
| TypeScript                 | Type safety, giảm lỗi runtime                |
| Vite                       | Build tool, dev server tốc độ cao            |
| Tailwind CSS               | Utility-first CSS framework                  |
| shadcn/ui + Radix UI       | Component library có sẵn, accessible         |
| Zustand                    | Global state management                      |
| React Hook Form + Zod      | Form handling và validation                  |
| React Router v7            | Client-side routing                          |
| Socket.io Client           | Kết nối realtime với server                  |
| Axios                      | HTTP client gọi API                          |
| Lucide React               | Icon library                                 |
| Sonner                     | Toast notification                           |

### Backend

| Công nghệ                  | Vai trò                                      |
| -------------------------- | -------------------------------------------- |
| Node.js + Express 5        | Runtime và web framework                     |
| MongoDB + Mongoose         | Database NoSQL và ODM                        |
| Socket.io                  | Realtime messaging (WebSocket)               |
| JWT (jsonwebtoken)         | Xác thực người dùng                          |
| bcrypt                     | Mã hóa mật khẩu                              |
| Cloudinary                 | Lưu trữ và xử lý ảnh upload                 |
| dotenv                     | Quản lý biến môi trường                      |
| cookie-parser              | Xử lý cookie chứa auth token                 |
| cors                       | Cấu hình Cross-Origin Resource Sharing       |

### Infrastructure & Deployment

| Dịch vụ                    | Vai trò                                      |
| -------------------------- | -------------------------------------------- |
| Vercel                     | Deploy frontend (Production + Preview)       |
| Render                     | Deploy backend (STG + PROD)                  |
| MongoDB Atlas              | Cloud database (STG + PROD)                  |
| GitHub Actions             | CI/CD pipeline — TypeScript check trước khi deploy |

---

## Tính năng chính

- Đăng ký / Đăng nhập với JWT authentication
- Nhắn tin trực tiếp (Direct Message) và chat nhóm
- Realtime — tin nhắn hiển thị ngay không cần refresh
- Gửi hình ảnh trong chat
- Kết bạn — gửi / chấp nhận / từ chối lời mời
- Online status — hiển thị ai đang online
- Thông báo tin nhắn chưa đọc
- Cập nhật thông tin cá nhân (avatar, ảnh bìa, bio, giới tính, ngày sinh)

---

## Cài đặt và chạy local

### Yêu cầu

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account (hoặc MongoDB local)
- Cloudinary account

### 1. Clone repository

```bash
git clone https://github.com/salmon-tech404/chatApp.git
cd chatApp
```

### 2. Cài đặt dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Cấu hình biến môi trường

Backend — tạo file `backend/.env`:

```env
NODE_ENV=development
SERVER_PORT=5000

MONGODB_CONNECTIONSTRING=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/chatapp_dev

SECRET_TOKEN=<chuỗi_random_tối_thiểu_32_ký_tự>
ACCESS_TOKEN_TTL=1h

CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

CLIENT_URL=http://localhost:5173
```

Frontend — tạo file `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Chạy ứng dụng

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

---

## Môi trường triển khai

| Môi trường | Frontend                              | Backend                        |
| ---------- | ------------------------------------- | ------------------------------ |
| STG        | Vercel Preview (branch: develop)      | Render (chatapp-backend-stg)   |
| PROD       | Vercel Production (branch: main)      | Render (chatapp-backend-prod)  |

### Quy trình phát triển

```
feature/xxx → develop  →  STG tự động deploy
                  └─► Pull Request → main  →  PROD tự động deploy
```

---

## Cấu trúc thư mục

```
chatApp/
├── backend/
│   └── src/
│       ├── controllers/   # Xử lý logic nghiệp vụ
│       ├── models/        # Mongoose schema
│       ├── routes/        # Định nghĩa API routes
│       ├── middlewares/   # Auth middleware
│       └── libs/          # Socket.io, MongoDB, Cloudinary
├── frontend/
│   └── src/
│       ├── components/    # React components
│       ├── store/         # Zustand global state
│       ├── services/      # API calls và socket service
│       ├── types/         # TypeScript interfaces
│       └── pages/         # Page components
└── .github/
    └── workflows/         # CI/CD GitHub Actions
```
