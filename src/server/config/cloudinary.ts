"use server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export async function uploadImage(
  file: File,
  transform?: boolean,
): Promise<UploadApiResponse> {
  const transformation = transform
    ? [
        { width: 500, height: 500, crop: "fill" },
        { effect: "background_removal" },
      ]
    : [];
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "my_uploads",
        transformation,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error("Upload failed: No result returned"));
        }
      },
    );
    uploadStream.end(buffer);
  });
}
