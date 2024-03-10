// backend/routes/placeRoutes.js
import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import Place from "../models/Place.js";
import parser from "../config/cloudinaryConfig.js";
import authenticateToken from "../middleware/authenticateToken.js";

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
      imagePublicId: req.file.filename,
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

// 장소 검색
router.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const regex = new RegExp(q, "i");
    const places = await Place.find({
      $or: [
        { name: regex },
        { location: regex },
        { description: regex },
        { featuredIn: regex },
      ],
    });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 장소 가져오기
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 장소 업데이트
router.put(
  "/:id",
  authenticateToken,
  parser.single("image"),
  async (req, res) => {
    try {
      const place = await Place.findById(req.params.id);
      if (!place) {
        return res.status(404).json({ message: "Place not found" });
      }

      if (place.addedBy !== req.user.username) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this place" });
      }

      // 새 이미지 처리
      if (req.file) {
        // 기존 이미지가 있으면 Cloudinary에서 삭제
        if (place.imagePublicId) {
          await cloudinary.uploader.destroy(place.imagePublicId);
        }
        // 새 이미지를 Cloudinary에 업로드하고 public_id 업데이트
        place.imagePublicId = req.file.filename; // cloudinary가 제공하는 filename
        place.imageUrl = req.file.path; // Cloudinary에서 접근 가능한 이미지 URL
      }

      // 다른 정보 업데이트
      place.name = req.body.name || place.name;
      place.location = req.body.location || place.location;
      place.description = req.body.description || place.description;
      place.featuredIn = req.body.featuredIn || place.featuredIn;
      place.genre = req.body.genre || place.genre;

      await place.save();
      res.json(place);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// 장소 삭제
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    if (place.addedBy !== req.user.username) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this place" });
    }

    if (place.imagePublicId) {
      await cloudinary.uploader.destroy(place.imagePublicId);
    }

    await Place.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
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
