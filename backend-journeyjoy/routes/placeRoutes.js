// backend/routes/placeRoutes.js
import { Router } from "express";
import Place from "../models/Place.js";

const router = Router();

// Add a new place
router.post("/add", async (req, res) => {
  const { name, location, description, imageUrl, featuredIn, addedBy } =
    req.body;
  try {
    const newPlace = new Place({
      name,
      location,
      description,
      imageUrl,
      featuredIn,
      addedBy,
    });
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all places
router.get("/", async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
