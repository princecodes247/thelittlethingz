"use server";

import { newId } from "@/lib/id-helper";
import path from "node:path";
import { convertToSlug } from "@/lib/utils";
import { getCloudinaryClient } from "@/lib/cloudinary";

export const putFileServer = async (formData: FormData) => {

  const rawFormData = {
    file: formData.get("file"),
  };
  if (!(rawFormData?.file instanceof File))
    return {
      data: null,
    };
  const { data } = await putFileInCloudinaryServer({ file: rawFormData.file });

  return { data };
};

export const putFileInCloudinaryServer = async ({
  file,
  photoId,
}: {
  file: File;
  photoId?: string;
}) => {
  if (!photoId) {
    photoId = newId("photo");
  }

  const client = getCloudinaryClient();
  const { name, ext } = path.parse(file.name);
  const key = `${photoId}-${convertToSlug(name)}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const base64data = buffer.toString("base64");

  console.log({ key, ext });
  try {
    const result = await client.uploader.upload(
      `data:image/${ext.slice(1)};base64,${base64data}`,
      {
        public_id: key,
        resource_type: "auto",
        folder: "albums",
        // Add more options as needed
      }
    );

    console.log("Upload successful", result);
    return {
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    };
  } catch (error) {
    console.error("Error uploading file to Cloudinary", error);
    throw error;
  }
};

export const putFilesServer = async (formData: FormData) => {

  // Extract files from the FormData
  const files: File[] = [];
  formData.forEach((value, key) => {
    if (key === "files[]" && value instanceof File) {
      files.push(value);
    }
  });

  if (files.length === 0) {
    return {
      data: null,
    };
  }

  const { data } = await putFilesInCloudinaryServer({ files });

  return { data };
};

export const putFilesInCloudinaryServer = async ({
  files,
  photoId,
}: {
  files: File[];
  photoId?: string;
}) => {
  const client = getCloudinaryClient();

  const uploadResults = await Promise.all(
    files.map(async (file) => {
      let currentPhotoId = photoId;
      if (!currentPhotoId) {
        currentPhotoId = newId("photo");
      }

      const { name, ext } = path.parse(file.name);
      const key = `${currentPhotoId}-${convertToSlug(name)}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64data = buffer.toString("base64");

      console.log({ key, ext });

      try {
        const result = await client.uploader.upload(
          `data:image/${ext.slice(1)};base64,${base64data}`,
          {
            public_id: key,
            resource_type: "auto",
            folder: "albums",
            // Add more options as needed
          }
        );

        console.log("Upload successful", result);
        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } catch (error) {
        console.error("Error uploading file to Cloudinary", error);
        throw error;
      }
    })
  );

  return {
    data: uploadResults,
  };
};

export const removeFileFromCloudinaryServer = async ({
  photoId,
}: {
  photoId: string;
}) => {
  const client = getCloudinaryClient();

  try {
    const result = await client.uploader.destroy(photoId);

    console.log("File removed successfully", result);
    return true;
  } catch (error) {
    console.error("Error uploading file to Cloudinary", error);
    throw error;
  }
};
