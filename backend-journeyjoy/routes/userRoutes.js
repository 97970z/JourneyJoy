// backend/routes/userRoutes.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtSecret } from "../config/envConfig.js";
import authenticateToken from "../middleware/authenticateToken.js";
import adminCheck from "../middleware/adminCheck.js";

const router = Router();

// 사용자 목록 조회
router.get("/", authenticateToken, adminCheck, async (req, res) => {
  const { _page = 1, _limit = 5 } = req.query;
  try {
    const users = await User.find()
      .skip((_page - 1) * parseInt(_limit))
      .limit(parseInt(_limit));
    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / parseInt(_limit));
    res.json({
      data: users,
      total,
      totalPages,
      page: parseInt(_page),
      limit: parseInt(_limit),
    });
  } catch (error) {
    next(error);
  }
});

// 사용자 정보 조회
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ username: user.username, role: user.role });
  } catch (error) {
    next(error);
  }
});

// 사용자 역할 업데이트
router.put("/:id/role", authenticateToken, adminCheck, async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.role = role;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
