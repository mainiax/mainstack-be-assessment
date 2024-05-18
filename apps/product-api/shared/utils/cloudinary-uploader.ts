import { UploadApiOptions } from "cloudinary";
import cloudinary from "../config/cloudinary.config";

export const cloudinaryFileUploader = async (
  file: string,
  options: UploadApiOptions
) => {
  return await cloudinary.uploader.upload(file, options);
};
