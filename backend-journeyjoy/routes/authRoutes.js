// backend/routes/authRoutes.js
import { Router } from "express";
import pkg from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();
const { hash, compare } = pkg;

// 회원가입
router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const hashedPassword = await hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && (await compare(req.body.password, user.password))) {
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET, // 환경변수에서 JWT 비밀키를 가져옵니다.
        { expiresIn: "1h" } // 토큰의 유효 기간을 1시간으로 설정
      );
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      user.refreshToken = refreshToken;
      await user.save();

      res.status(200).json({ accessToken, refreshToken });
    } else {
      res.status(400).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Refresh Token을 사용하여 새로운 Access Token 발급
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  console.log("refreshToken:", refreshToken);
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh Token is required" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    console.log("user:", user);
    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Refresh Token is not valid" });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("newAccessToken:", newAccessToken);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid Refresh Token" });
  }
});

export default router;
