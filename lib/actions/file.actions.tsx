"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import {
  constructFileUrl,
  getFileType,
  handleError,
  parseStringify,
} from "../utils";
import { InputFile } from "node-appwrite/file";
import { revalidatePath } from "next/cache";

export const uploadFile = async ({
  file,
  accountId,
  path,
  ownerId,
}: uploadFileProp) => {
  const { storage, database } = await createAdminClient();
  try {
    // Convert File to ArrayBuffer first, then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const inputFile = InputFile.fromBuffer(fileBuffer, file.name);
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );
    const { type, extension } = getFileType(bucketFile.name);
    const fileDocument = {
      type: type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId: accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };
    const newFile = await database
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (err) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(err, "Failed to create file document");
      });
    revalidatePath(path);
    return parseStringify(newFile);
  } catch (err) {
    handleError(err, "Failed to upload file(s)");
  }
};
