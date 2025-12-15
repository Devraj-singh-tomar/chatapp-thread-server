import {
  repoUpdateUserProfile,
  upsertUserFromClerkProfile,
} from "./user.repository.js";
import type { UserProfileType } from "./user.types.js";
import { clerkClient } from "@clerk/express";

async function fetchClerkProfile(clerkUserId: string) {
  const clerkUser = await clerkClient.users.getUser(clerkUserId);

  const getFullName =
    (clerkUser.firstName || "") +
    (clerkUser.lastName ? ` ${clerkUser.lastName}` : "");

  const fullName = getFullName.trim().length > 0 ? getFullName.trim() : "";

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    ) ?? clerkUser.emailAddresses[0];

  const email = primaryEmail?.emailAddress ?? null;
  const avatarUrl = clerkUser?.imageUrl ?? null;

  return {
    fullName,
    email,
    avatarUrl,
  };
}

export async function getUserFromClerk(
  clerkUserId: string
): Promise<UserProfileType> {
  const { avatarUrl, email, fullName } = await fetchClerkProfile(clerkUserId);

  const user = await upsertUserFromClerkProfile({
    clerkUserId,
    displayName: fullName,
    avatarUrl,
  });

  return {
    user,
    clerkEmail: email,
    clerkFullName: fullName,
  };
}

export async function updateUserProfile(params: {
  clerkUserId: string;
  displayName?: string;
  handle?: string;
  bio?: string;
  avatarUrl?: string;
}): Promise<UserProfileType> {
  // const { clerkUserId, avatarUrl, bio, displayName, handle } = params;

  // const updatedUser = await repoUpdateUserProfile({
  //   clerkUserId,
  //   displayName,
  //   handle,
  //   bio,
  //   avatarUrl,
  // });

  const { clerkUserId } = params;

  const updateData: {
    clerkUserId: string;
    displayName?: string;
    handle?: string;
    bio?: string;
    avatarUrl?: string;
  } = { clerkUserId };

  if (params.displayName !== undefined)
    updateData.displayName = params.displayName;

  if (params.handle !== undefined) updateData.handle = params.handle;

  if (params.bio !== undefined) updateData.bio = params.bio;

  if (params.avatarUrl !== undefined) updateData.avatarUrl = params.avatarUrl;

  const updatedUser = await repoUpdateUserProfile(updateData);

  const { fullName, email } = await fetchClerkProfile(clerkUserId);

  return {
    user: updatedUser,
    clerkEmail: email,
    clerkFullName: fullName,
  };
}
