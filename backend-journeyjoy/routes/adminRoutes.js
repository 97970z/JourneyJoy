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
  const { _page = 1, _limit = 10 } = req.query;
  const skip = (_page - 1) * _limit;
  try {
    const places = await Place.find().skip(skip).limit(Number(_limit));
    const total = await Place.countDocuments();
    res.json({ data: places, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
