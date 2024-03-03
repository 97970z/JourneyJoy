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
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET, // 환경변수에서 JWT 비밀키를 가져옵니다.
        { expiresIn: "1h" } // 토큰의 유효 기간을 1시간으로 설정
      );
      res.status(200).json(token);
    } else {
      res.status(400).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 토큰 검증
router.post("/verify", (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    res.json(true);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
