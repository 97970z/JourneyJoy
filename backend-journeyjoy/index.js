// backend/index.js
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { mongoURI, PORT } from "./config/envConfig.js";

const app = express();

app.use(helmet()); // 보안 헤더 설정
app.use(cors()); // CORS 미들웨어 추가
app.use(express.json()); // JSON 요청 본문 파싱
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10분
    max: 100, // 각 IP를 요청 100개로 제한.
  })
);

// MongoDB 연결
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
