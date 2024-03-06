// backend/routes/placeRoutes.js
import { Router } from "express";
import Place from "../models/Place.js";
import parser from "../config/cloudinaryConfig.js";

const router = Router();

// 장소 추가
router.post("/add", parser.single("image"), async (req, res) => {
  const { name, location, description, featuredIn, genre, addedBy } = req.body;
  if (req.file.size > MAX_FILE_SIZE) {
    return res
      .status(400)
      .json({ message: "이미지 용량은 1.5MB를 넘을 수 없습니다." });
  }
  try {
    const newPlace = new Place({
      name,
      location,
      description,
      imageUrl: req.file.path, // 이미지 URL을 클라우드에 저장된 URL로 설정
      featuredIn,
      genre,
      addedBy,
    });
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 모든 장소 가져오기
router.get("/", async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
