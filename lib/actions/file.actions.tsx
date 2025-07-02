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

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText?: string,
  sort?: string,
  limit?: number
) => {
  const queries = [
    Query.or([
      Query.equal("owner", currentUser.$id),
      Query.contains("users", currentUser.email),
    ]),
  ];
  if (types.length > 0) {
    queries.push(Query.equal("type", types));
  }
  console.log(`i am ${searchText}`)
  if (searchText) {
    queries.push(Query.contains("name", searchText));
  }
  if (limit) {
    queries.push(Query.limit(limit));
  }

  const [sortBy, orderBy] = sort?.split("-") || []

  queries.push(orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy))

  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const { database } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");
    const queries = createQueries(currentUser, types, searchText, sort, limit);
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

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
  action,
}: UpdateFileUsersProps) => {
  const { database } = await createAdminClient();
  try {
    // Get the current file to read its users
    const file = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );

    let updatedUsers: string[] = [];

    switch (action) {
      case "share":
        // Add new emails to the existing users, avoiding duplicates
        updatedUsers = Array.from(new Set([...(file.users || []), ...emails]));
        break;
      case "remove":
        // Remove the specified emails from the existing users
        updatedUsers = (file.users || []).filter(
          (user: string) => !emails.includes(user)
        );
        break;
      default:
        return file.users;
    }

    const updatedFile = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: updatedUsers,
      }
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to update file users");
  }
};

export const deleteFIleUser = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { storage, database } = await createAdminClient();
  try {
    const deletedFile = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );
    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }
    revalidatePath(path);
    return parseStringify({ msg: "success" });
  } catch (error) {
    handleError(error, "Error deleting File");
  }
};
