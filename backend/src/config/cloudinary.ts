import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../app/errorHelper/AppError";
import { StatusCodes } from "http-status-codes";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

// upload file to cloudinary without multer-storage-cloudinary package 
export const uploadFileToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse> => {

  if (!buffer || !fileName) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Buffer and fileName are required for upload");
  }

  const extension = fileName.split('.').pop()?.toLocaleLowerCase();
  const fileNameWithoutExtension = fileName.split('.').slice(0, -1)
    .join('.')
    .toLocaleLowerCase()
    .replace(/\s/g, '-')
    .replace(/[^a-z0-9-]/g, '');


  const uniqueName = Math.random().toString(36).substring(2)
    + "-" + Date.now() + "-" + fileNameWithoutExtension

  const folder = extension === 'pdf' ? 'pdfs' : 'images';

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({
      folder: `pordo/${folder}`,
      public_id: uniqueName,
      resource_type: 'auto',
    }, async (error, result) => {
      if (error) {
        return reject(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary"));
      }
      resolve(result as UploadApiResponse);
    }).end(buffer);
  })
}


export const deleteFileFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);

    if (match && match[1]) {
      const publicId = match[1];

      await cloudinary.uploader.destroy(
        publicId, {
        resource_type: "image"
      }
      )

      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (e) {
    console.log(e);
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
}




export const cloudinaryUpload = cloudinary