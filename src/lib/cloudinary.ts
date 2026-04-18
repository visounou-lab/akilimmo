import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export type UploadResult = {
  url:      string;
  publicId: string;
};

export async function uploadImage(file: File): Promise<UploadResult> {
  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "akilimmo/biens", resource_type: "image" },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Upload failed"));
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      )
      .end(buffer);
  });
}
