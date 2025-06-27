"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { handleError, parseStringify } from "../utils";
import { avatarPlaceHolderUrl } from "@/constants";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const getUserByEamil = async (email: string) => {
  const { database } = await createAdminClient();
  const result = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (err) {
    handleError(err, "Failed to send email OTP");
  }
};

export const createAccout = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEamil(email);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send email OTP");

  const { database } = await createAdminClient();
  await database.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    ID.unique(),
    {
      fullName,
      email,
      avatar: avatarPlaceHolderUrl,
      accountId,
    }
  );

  return parseStringify(accountId);
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);
    const { cookies } = await import("next/headers");
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      sameSite: true,
      httpOnly: true,
      secure: true,
    });

    return parseStringify({ sessionId: session.secret });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { account, database } = await createSessionClient();
    const result = await account.get();
    const user = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", [result.$id])]
    );
    return user.total > 0 ? parseStringify(user.documents[0]) : null;
  } catch (err) {
    if (err instanceof Error && err.message === "No session") {
      return null;
    }
    handleError(err, "Unable to get current User");
    return null;
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();
  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
    console.log("User logged out successfully");
  } catch (error) {
    handleError(error, "Failed to log out user:");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEamil(email);
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }
    return parseStringify({ accountId: null, error: "User not found" });
  } catch (err) {
    handleError(err, "Failed to sign in user");
  }
};
