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
router.get("/all", authenticateToken, adminCheck, async (req, res, next) => {
  const { _page = 1, _limit = 5, status } = req.query;
  const query = status ? { status } : {};
  try {
    const places = await Place.find(query)
      .skip((_page - 1) * parseInt(_limit))
      .limit(parseInt(_limit));
    const total = await Place.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(_limit));
    res.json({
      data: places,
      total,
      totalPages,
      page: parseInt(_page),
      limit: parseInt(_limit),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
