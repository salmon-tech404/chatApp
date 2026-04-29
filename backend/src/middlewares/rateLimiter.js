import RateLimitLog from "../models/RateLimitLog.js";

// Lưu trạng thái trong memory (key -> {count, resetAt, blocked, unblockAt})
const store = new Map();

export const createRateLimiter = ({ max, windowMs, reason }) => {
  return async (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    let record = store.get(key);
    console.log("record: ", record);

    // 1. Đang bị block → chặn ngay, không cần đếm
    if (record?.blocked && now < record.unblockAt) {
      return res.status(429).json({
        error: reason,
        unblockAt: new Date(record.unblockAt),
      });
    }

    // 2. Hết window → reset counter
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + windowMs, blocked: false };
    }

    // 3. Tăng counter
    record.count++;
    store.set(key, record);

    // 4. Vượt giới hạn → block + ghi DB
    if (record.count > max) {
      const unblockAt = new Date(now + windowMs);

      record.blocked = true;
      record.unblockAt = unblockAt.getTime();

      // Ghi log — không await để không làm chậm response
      RateLimitLog.create({
        ip: req.ip,
        userId: req.user?._id?.toString() ?? null,
        username: req.user?.username ?? null,
        route: req.originalUrl,
        method: req.method,
        userAgent: req.headers["user-agent"],
        blockAt: new Date(),
        unblockAt,
        reason,
      }).catch(console.error);

      return res.status(429).json({
        error: reason,
        unblockAt,
      });
    }

    next();
  };
};
