"use server";

import { ID, Models, Query } from "node-appwrite";
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
import { getCurrentUser } from "./users.actions";

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

const createQueries = (currentUser: Models.Document) => {
  const queries = [
    Query.or([
      Query.equal("owner", currentUser.$id),
      Query.contains("users", currentUser.email),
    ]),
  ];
  return queries;
};

export const getFiles = async () => {
  const { database } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");
    const queries = createQueries(currentUser);
    const files = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );
    return parseStringify(files);
  } catch (err) {
    handleError(err, "Failed to get files");
  }
};

export const renameFiles = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { database } = await createAdminClient();
  try {
    const newName = `${name}.${extension}`;
    const newFile = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      }
    );
    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};
