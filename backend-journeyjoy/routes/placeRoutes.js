// backend/routes/placeRoutes.js
import { Router } from "express";
import Place from "../models/Place.js";
import parser from "../config/cloudinaryConfig.js";

const router = Router();

// 장소 추가
router.post("/add", parser.single("image"), async (req, res) => {
  const { name, location, description, featuredIn, genre, addedBy } = req.body;
  try {
    const newPlace = new Place({
      name,
      location,
      description,
      imageUrl: req.file.path,
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
