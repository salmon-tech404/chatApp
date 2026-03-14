<!-- Thư viện -->

| Nhóm              | Thư viện            | Dùng để          |
| ----------------- | ------------------- | ---------------- |
| Routing           | react-router        | chuyển trang     |
| API               | axios               | gọi backend      |
| UI                | lucide-react        | icon             |
| Style             | tailwindcss         | CSS              |
| Tailwind          | @tailwindcss/vite   | tối ưu vite      |
| Animation         | tailwindcss-animate | hiệu ứng         |
| State             | zustand             | global state     |
| Validation        | zod                 | kiểm tra dữ liệu |
| Form              | react-hook-form     | xử lý form       |
| Form + Validation | resolvers           | nối zod          |
| Notification      | sonner              | toast            |
| Dev               | @types/node         | type Node        |

<!-- Cấu trúc thư mục -->

frontend/src/
├── assets/ # hình ảnh, icon, font
├── components/ # component dùng chung nhiều nơi
│ ├── ui/ # button, input, modal... (atomic)
│ └── layout/ # header, sidebar, navbar...
├── pages/ # mỗi file = 1 trang
│ ├── HomePage.tsx
│ ├── LoginPage.tsx
│ └── ChatPage.tsx
├── routes/ # cấu hình routing
│ └── index.tsx
├── store/ # zustand - global state
│ └── authStore.ts
├── services/ # gọi API (axios)
│ └── authService.ts
├── hooks/ # custom hooks
│ └── useAuth.ts
├── types/ # TypeScript interfaces/types
│ └── index.ts
├── utils/ # hàm tiện ích
│ └── helpers.ts
├── App.tsx
└── main.tsx

<!-- Ý nghĩa -->

pages/ → User thấy gì? (Login, Chat, Home)
components/ → Tái sử dụng UI (Button, Input, Card)
routes/ → Điều hướng giữa các trang
store/ → Lưu state toàn app (user đang login là ai?)
services/ → Nói chuyện với backend API
hooks/ → Logic tái sử dụng
types/ → Định nghĩa kiểu dữ liệu TypeScript
utils/ → Hàm nhỏ dùng chung (format date, v.v.)
