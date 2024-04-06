// backend/models/Place.js
import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    featuredIn: [{ type: String }],
    genre: [{ type: String }],
    addedBy: { type: String, ref: "User" },
    status: { type: String, required: true, default: "Pending" },
  },
  { timestamps: true }
);

placeSchema.index({ name: 1, location: 1 }); // Creating an index

export default mongoose.model("Place", placeSchema);
