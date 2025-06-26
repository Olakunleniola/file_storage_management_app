"use server";

import { ID } from "node-appwrite";
import { createAdminClient, getUserByEamil, sendEmailOTP } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";

export const createAccout = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEamil(email);
  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send email OTP");
  if (!existingUser) {
    const { database } = await createAdminClient();
    await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar:
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
        accountId,
      }
    );
  }
  return parseStringify(accountId)
};
