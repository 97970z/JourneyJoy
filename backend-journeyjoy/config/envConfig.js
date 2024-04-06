import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const mongoURI = process.env.MONGODB_URI;
export const jwtSecret = process.env.JWT_SECRET;
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
export const cloudinaryConfig = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
};
