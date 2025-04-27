import multer from "multer";
import path from "path";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: "dxbf4qzll",
  api_key: "968752122211762",
  api_secret: "Oet9gAk-imnC-6d7flndrQ22WM4",
});
const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<UploadApiResponse | undefined> => {
  // Upload an image
  const uploadResult = await cloudinary.uploader.upload(file.path, {
    public_id: file.originalname,
  });
  try {
    fs.unlinkSync(file.path);
  } catch (error) {
    console.error("Error deleting temp file:", error);
  }

  console.log("upload to file:", uploadResult);
  return uploadResult;
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
export const fileUploader = {
  upload,
  uploadToCloudinary,
};
