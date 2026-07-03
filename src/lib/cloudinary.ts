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

export type PrivateDocumentUploadResult = {
  storageKey: string;
  format: string;
};

export async function deleteImage(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) return reject(error);
      resolve();
    });
  });
}

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

export async function uploadVehicleImage(file: File): Promise<UploadResult> {
  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "akilimmo/voitures", resource_type: "image" },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Upload failed"));
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      )
      .end(buffer);
  });
}

export async function uploadPrivateVerificationDocument(
  buffer: Buffer,
  extension: string,
): Promise<PrivateDocumentUploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "akilimmo/verification",
          resource_type: "raw",
          type: "authenticated",
          access_mode: "authenticated",
          format: extension,
          use_filename: false,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Upload privé impossible"));
          resolve({
            storageKey: result.public_id,
            format: result.format ?? extension,
          });
        },
      )
      .end(buffer);
  });
}

export function privateVerificationDocumentUrl(
  storageKey: string,
  format: string,
  expiresAt: number,
): string {
  return cloudinary.utils.private_download_url(storageKey, format, {
    resource_type: "raw",
    type: "authenticated",
    expires_at: expiresAt,
    attachment: true,
  });
}

export async function deletePrivateVerificationDocument(storageKey: string): Promise<void> {
  await cloudinary.uploader.destroy(storageKey, {
    resource_type: "raw",
    type: "authenticated",
    invalidate: true,
  });
}
