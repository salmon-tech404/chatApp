Thực ra **`libs` không phải thư viện cài bằng npm**, mà là **các helper / module dùng lại nhiều lần trong project**.

---

# 1️⃣ `libs` nghĩa là gì trong project

`libs` = **libraries nội bộ của project**

Tức là:

```text
libs = các file tiện ích dùng chung
```

Ví dụ:

```text
libs
 ├── mongodb.js
 ├── socket.js
 ├── jwt.js
 └── cloudinary.js
```

Các file này:

- không phải controller
- không phải route
- không phải model

mà là **logic dùng chung toàn hệ thống**

---

# 2️⃣ Ví dụ cụ thể

### File connect database

```javascript
src / libs / mongodb.js;
```

```javascript
import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};
```

File này sẽ được **dùng lại ở nhiều nơi**.

---

### Ví dụ JWT

```text
libs/jwt.js
```

```javascript
import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
```

Controller login sẽ dùng lại.

---

# 3️⃣ So sánh các folder backend

| Folder      | Chức năng           |
| ----------- | ------------------- |
| controllers | xử lý logic API     |
| routes      | định nghĩa endpoint |
| models      | schema database     |
| middlewares | chạy giữa request   |
| libs        | tiện ích dùng chung |

---

# 4️⃣ Tại sao không để trong `server.js`

Nếu viết hết trong `server.js`:

```javascript
mongoose.connect(...)
jwt.sign(...)
socket.io(...)
cloudinary config...
```

→ file sẽ **rất dài và khó bảo trì**

---

# 5️⃣ Kiến trúc backend chuẩn

Backend lớn thường như này:

```text
src
 ├── controllers
 ├── routes
 ├── models
 ├── middlewares
 ├── libs
 │    ├── db.js
 │    ├── jwt.js
 │    └── socket.js
 ├── utils
 └── server.js
```

---

# 6️⃣ Một số project dùng tên khác

Không phải ai cũng dùng `libs`.

Có thể gặp:

```text
config
services
utils
helpers
core
```

Ví dụ:

```text
config/db.js
```

hoặc

```text
utils/jwt.js
```

---

✅ **Kết luận**

`libs` chỉ là:

```text
code tiện ích dùng chung trong project
```

không phải thư viện npm.
