# Git Workflow

## Môi trường

| Branch    | Môi trường | Frontend | Backend |
| --------- | ---------- | -------- | ------- |
| `develop` | STG  | [chat-app-git-develop-salmon-tech404s-projects.vercel.app](https://chat-app-git-develop-salmon-tech404s-projects.vercel.app) | [chatapp-backend-stg.onrender.com](https://chatapp-backend-stg.onrender.com) |
| `main`    | PROD | [chat-app-theta-puce.vercel.app](https://chat-app-theta-puce.vercel.app) | [chatapp-backend-prod.onrender.com](https://chatapp-backend-prod.onrender.com) |

---

## Luồng làm việc

```
feature/xxx  ->  develop (STG)  ->  main (PROD)
```

---

## Các bước thực hiện

### 1. Tạo branch mới

```bash
git checkout develop
git pull origin develop
git checkout -b feature/ten-tinh-nang
```

### 2. Code và commit

```bash
git add .
git commit -m "feat: mô tả ngắn gọn"
```

### 3. Push lên GitHub

```bash
git push origin feature/ten-tinh-nang
```

### 4. Tạo PR vào develop (STG)

1. GitHub → **Pull requests** → **New pull request**
2. **base:** `develop` ← **compare:** `feature/ten-tinh-nang`
3. **Create pull request** → **Merge pull request**
4. GitHub Actions tự chạy TypeScript check → deploy Render STG
5. Vercel tự build preview cho branch `develop`

### 5. Test trên STG

Mở link STG và kiểm tra tính năng vừa làm.

### 6. Xóa branch feature

```bash
# Xóa trên remote
git push origin --delete feature/ten-tinh-nang

# Xóa trên local
git branch -d feature/ten-tinh-nang
```

> Hoặc click **Delete branch** ngay sau khi merge PR trên GitHub.

### 7. Tạo PR vào main (PROD)

1. GitHub → **Pull requests** → **New pull request**
2. **base:** `main` ← **compare:** `develop`
3. **Create pull request** → **Merge pull request**
4. GitHub Actions tự chạy TypeScript check → deploy Render PROD
5. Vercel tự build production

---

## Quy ước đặt tên branch

| Loại       | Prefix      | Ví dụ                  |
| ---------- | ----------- | ---------------------- |
| Tính năng  | `feat/`     | `feat/add-group-chat`  |
| Sửa lỗi    | `fix/`      | `fix/login-cors-error` |
| UI / style | `ui/`       | `ui/responsive-mobile` |
| Refactor   | `refactor/` | `refactor/chat-store`  |

## Quy ước commit message

| Prefix     | Dùng khi                  |
| ---------- | ------------------------- |
| `feat:`    | Thêm tính năng mới        |
| `fix:`     | Sửa bug                   |
| `ui:`      | Cập nhật giao diện        |
| `refactor:`| Tối ưu code, không đổi UI |
| `chore:`   | Config, deps, tooling     |
