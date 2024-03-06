import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "dl6f9clxo",
  api_key: "786817943814232",
  api_secret: "AbMD-kDgOk7Cf3cVWH199k0BjKg",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "journeyjoy",
    allowedFormats: ["jpg", "png"],
  },
});

const parser = multer({ storage });

export default parser;
