// backend/models/User.js
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "user" },
  refreshToken: { type: String },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, required: false },
});

export default model("User", userSchema);
