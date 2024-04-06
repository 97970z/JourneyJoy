// backend/routes/adminRoutes.js
import { Router } from "express";
import Place from "../models/Place.js";
import adminCheck from "../middleware/adminCheck.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = Router();

router.get("/", adminCheck, (req, res) => {
  res.send("Admin route");
});

// 관리자 패널에서 모든 장소 가져오기
router.get("/all", authenticateToken, adminCheck, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const places = await Place.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();
    const total = await Place.countDocuments();
    res.json({
      data: places,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
