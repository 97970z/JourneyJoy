// backend/routes/placeRoutes.js
import { Router } from "express";
import axios from "axios";
import * as XLSX from "xlsx";
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
let cachedMovieFilmPlaces = [];
let cachedTvFilmPlaces = [];

const fetchDataIfEmpty = async (cache, fetchFunction) => {
  if (cache.length === 0) {
    await fetchFunction();
  }
};

const handleGetMovieFilmPlaces = async (req, res) => {
  await fetchDataIfEmpty(cachedMovieFilmPlaces, fetchMovieFilmPlacesData);
  res.json(cachedMovieFilmPlaces);
};

const handleGetTvFilmPlaces = async (req, res) => {
  await fetchDataIfEmpty(cachedTvFilmPlaces, fetchTvFilmPlacesData);
  res.json(cachedTvFilmPlaces);
};

const handleGetFestivals = async (req, res) => {
  await fetchDataIfEmpty(cachedFestivalData, fetchSeoulFestivalData);
  res.json(cachedFestivalData);
};

router.get("/movieFilmPlaces", handleGetMovieFilmPlaces);
router.get("/tvFilmPlaces", handleGetTvFilmPlaces);
router.get("/festivals", handleGetFestivals);

router.post(
  "/add",
  parser.single("image"),
  authenticateToken,
  async (req, res, next) => {
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
      next(error);
    }
  }
);

router.get("/search", async (req, res, next) => {
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
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    next(error);
  }
});

// 장소 업데이트
router.put(
  "/:id",
  authenticateToken,
  parser.single("image"),
  async (req, res, next) => {
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

      if (req.file) {
        if (place.imagePublicId) {
          await cloudinary.uploader.destroy(place.imagePublicId);
        }
        place.imagePublicId = req.file.filename;
        place.imageUrl = req.file.path;
      }

      ["name", "location", "description", "featuredIn", "genre"].forEach(
        (field) => {
          if (req.body[field]) {
            place[field] = req.body[field];
          }
        }
      );

      place.status = "Pending";

      await place.save();
      res.json(place);
    } catch (error) {
      next(error);
    }
  }
);

// 장소 삭제
router.delete("/:id", authenticateToken, async (req, res, next) => {
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
    next(error);
  }
});

router.get("/status/:status", async (req, res, next) => {
  const { status } = req.params;
  try {
    const places = await Place.find({ status });
    res.json(places);
  } catch (error) {
    next(error);
  }
});

// 장소 상태 업데이트
router.put(
  "/:id/status",
  authenticateToken,
  adminCheck,
  async (req, res, next) => {
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
      next(error);
    }
  }
);

const fetchMovieFilmPlacesData = async () => {
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

    cachedMovieFilmPlaces = items
      .filter(
        (item) =>
          item.sceneDesc &&
          item.sceneDesc._text &&
          item.sceneDesc._text.trim() !== ""
      )
      .map((item) => ({
        id: item.filmingSeq._text,
        movieTitle: item.movieTitle._text,
        filmingLocation: item.filmingLocation._text,
        productionYear: item.productionYear?._text ?? "N/A",
        sceneDesc: item.sceneDesc?._text,
        sido: item.sido._text,
        lat: parseFloat(item.latitude._text),
        lng: parseFloat(item.longitude._text),
      }));
  } catch (error) {
    console.error("Failed to fetch external places:", error);
  }
};

const fetchTvFilmPlacesData = async () => {
  try {
    const url =
      "https://docs.google.com/spreadsheets/d/1_rIz3FCXkfaua2fqwN5l2WmMZIkZxqwq/export?format=xlsx";
    const response = await axios({
      url,
      method: "GET",
      responseType: "arraybuffer",
    });

    const data = new Uint8Array(response.data);
    const workbook = XLSX.read(data, { type: "array" });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 2 });

    cachedTvFilmPlaces = jsonData;
  } catch (error) {
    console.error("Error fetching or reading the Excel file", error);
  }
};

const fetchSeoulFestivalData = async () => {
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
};

export default router;
