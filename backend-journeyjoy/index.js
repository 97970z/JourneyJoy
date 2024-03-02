import express from "express";
import mongoose from "mongoose";
// .env 파일에서 환경변수 불러오기
import dotenv from "dotenv";
dotenv.config();
const mongoURI = process.env.MONGODB_URI;

// MongoDB 연결
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established."))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello, JourneyJoy!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
