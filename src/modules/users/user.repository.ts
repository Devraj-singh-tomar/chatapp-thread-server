import { query } from "../../db/db.js";
import type { UserRowType, UserType } from "./user.types.js";

function hydrateUser(row: UserRowType): UserType {
  return {
    id: row.id,
    clerkUserId: row.clerk_user_id,
    displayName: row.display_name,
    handle: row.handle,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function upsertUserFromClerkProfile(params: {
  clerkUserId: string;
  displayName: string | null;
  avatarUrl: string | null;
}): Promise<UserType> {
  const { avatarUrl, clerkUserId, displayName } = params;

  const result = await query<UserRowType>(
    `
    INSERT INTO users (clerk_user_id, display_name, avatar_url)
    VALUES ($1, $2, $3)
    ON CONFLICT (clerk_user_id)
    DO UPDATE SET
           updated_at   = NOW()
        RETURNING
           id,
           clerk_user_id,
           display_name,
           handle,
           avatar_url,
           bio,
           created_at,
           updated_at
    `,
    [clerkUserId, displayName, avatarUrl]
  );
  return hydrateUser(result.rows[0]!);
}
