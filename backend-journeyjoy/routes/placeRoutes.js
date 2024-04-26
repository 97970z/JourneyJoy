// backend/routes/placeRoutes.js
import { Router } from "express";
import axios from "axios";
import { xml2js } from "xml-js";
import { v2 as cloudinary } from "cloudinary";
import Place from "../models/Place.js";
import User from "../models/User.js";
import parser from "../config/cloudinaryConfig.js";
import authenticateToken from "../middleware/authenticateToken.js";
import adminCheck from "../middleware/adminCheck.js";
import { seoulDataApiKey, openApiServiceKey } from "../config/envConfig.js";

const router = Router();

let cachedFestivalData = [];
let cachedExternalPlaces = [];

// 공공데이터(영화 촬영 장소) 가져오기
router.get("/external-places", (req, res) => {
  if (cachedExternalPlaces.length === 0) {
    return res
      .status(404)
      .json({ message: "No external places data available" });
  }
  res.json(cachedExternalPlaces);
});

// 공공데이터(축제 데이터) 가져오기
router.get("/festivals", (req, res) => {
  if (cachedFestivalData.length === 0) {
    return res.status(404).json({ message: "No festival data available" });
  }
  res.json(cachedFestivalData);
});

// 장소 추가
router.post(
  "/add",
  parser.single("image"),
  authenticateToken,
  async (req, res) => {
    const { name, location, description, featuredIn, genre, addedBy } =
      req.body;

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
        status: "Pending",
      });
      await newPlace.save();
      res.status(201).json(newPlace);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

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

    const getUserRole = await User.findById(req.user.id);

    if (place.addedBy !== req.user.userId && getUserRole.role !== "admin") {
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

router.get("/status/:status", async (req, res) => {
  const { status } = req.params;
  try {
    const places = await Place.find({ status: status });
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 장소 상태 업데이트
router.put("/:id/status", authenticateToken, adminCheck, async (req, res) => {
  const { status } = req.body;
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).send("Place not found");
    }

    if (status === "Rejected") {
      if (place.imagePublicId) {
        await cloudinary.uploader.destroy(place.imagePublicId);
      }

      await Place.deleteOne({ _id: req.params.id });
      return res.status(204).send();
    }

    place.status = status;
    await place.save();
    res.json(place);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

const fetchExternalPlacesData = async () => {
  try {
    const response = await axios.get(
      "https://apis.data.go.kr/B551010/locfilming/locfilmingList",
      {
        params: {
          serviceKey: openApiServiceKey,
          pageNo: 1,
          numOfRows: 20000,
        },
      }
    );
    const result = xml2js(response.data, { compact: true, spaces: 4 });
    let items = result.response?.item ?? [];
    if (!Array.isArray(items)) items = [items];

    cachedExternalPlaces = items.map((item) => ({
      id: item.filmingSeq._text,
      movieTitle: item.movieTitle._text,
      filmingLocation: item.filmingLocation._text,
      productionYear: item.productionYear?._text ?? "N/A",
      sceneDesc: item.sceneDesc?._text ?? "",
      sido: item.sido._text,
      lat: parseFloat(item.latitude._text),
      lng: parseFloat(item.longitude._text),
    }));
  } catch (error) {
    console.error("Failed to fetch external places:", error);
  }
};

async function fetchFestivalData() {
  try {
    let festivals = [];
    const KEY = seoulDataApiKey;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 5; i++) {
      const start = 1 + 1000 * i;
      const end = 1000 * (i + 1);
      const response = await axios.get(
        `http://openapi.seoul.go.kr:8088/${KEY}/json/culturalEventInfo/${start}/${end}`
      );
      const fetchedFestivals = response.data.culturalEventInfo.row;

      const validFestivals = fetchedFestivals.filter((festival) => {
        const dateRange = festival.DATE.split("~");
        const endDate = new Date(dateRange[1].trim());
        return endDate >= today;
      });

      festivals = festivals.concat(validFestivals);
    }
    cachedFestivalData = festivals;
  } catch (error) {
    console.error("Failed to fetch festival data:", error);
  }
}

setInterval(async () => {
  await fetchExternalPlacesData();
  await fetchFestivalData();
}, 86400000);

fetchExternalPlacesData();
fetchFestivalData();

export default router;
