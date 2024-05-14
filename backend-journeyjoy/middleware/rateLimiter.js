// backend/middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10분
  max: 100, // 각 IP를 요청 100개로 제한.
  handler: (req, res, next) => {
    res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  },
});

export default apiLimiter;
