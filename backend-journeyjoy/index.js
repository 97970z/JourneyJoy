// backend/index.js
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import apiLimiter from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";
import { mongoURI, PORT } from "./config/envConfig.js";

const app = express();

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // 기본 설정
      scriptSrc: [
        "'self'",
        "https://dapi.kakao.com",
        "https://t1.daumcdn.net",
        "'unsafe-eval'",
      ],
      imgSrc: [
        "'self'",
        "https://res.cloudinary.com",
        "https://t1.daumcdn.net",
        "data:",
        "*",
        "blob:",
      ],
      connectSrc: ["'self'", "https://dapi.kakao.com"],
    },
  })
);
app.use(cors()); // CORS 미들웨어 추가
app.use(express.json()); // JSON 요청 본문 파싱
app.use(apiLimiter);

// MongoDB 연결
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
