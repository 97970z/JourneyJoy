// backend/config/cloudinaryConfig.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryConfig } from "../config/envConfig.js";

cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "journeyjoy",
    allowedFormats: ["jpg", "png"],
    quality: "auto",
  },
});

const parser = multer({ storage });

export default parser;
