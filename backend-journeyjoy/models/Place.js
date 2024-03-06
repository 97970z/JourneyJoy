// backend/models/Place.js
import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    featuredIn: [{ type: String }],
    genre: [{ type: String }],
    addedBy: { type: String, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Place", placeSchema);
