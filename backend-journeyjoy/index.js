// backend/index.js
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";

const mongoURI = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // JSON 요청 본문 파싱
app.use(cors()); // CORS 미들웨어 추가

// MongoDB 연결
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established."))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/places", placeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
