// backend/models/User.js
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  refreshToken: { type: String },
});

export default model("User", userSchema);
