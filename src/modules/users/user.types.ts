//  Schema for DB
export type UserRowType = {
  id: number;
  clerk_user_id: string;
  display_name: string;
  handle: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: Date;
  updated_at: Date;
};

// that we are going to expose to API
export type UserType = {
  id: number;
  clerkUserId: string;
  displayName: string;
  handle: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfileType = {
  user: UserType;
  clerkEmail: string | null;
  clerkFullName: string | null;
};

export type UserProfileResponseType = {
  id: number;
  clerkUserId: string;
  displayName: string | null;
  email: string | null;
  handle: string | null;
  avatarUrl: string | null;
  bio: string | null;
};

export function ToUserProfileResponse(
  profile: UserProfileType
): UserProfileResponseType {
  const { clerkEmail, clerkFullName, user } = profile;

  return {
    id: user.id,
    clerkUserId: user.clerkUserId,
    email: clerkEmail ?? null,
    displayName: user.displayName ?? clerkFullName ?? null,
    handle: user.handle ?? null,
    avatarUrl: user.avatarUrl ?? null,
    bio: user.bio ?? null,
  };
}
