// utils/auth.ts
import { getSession } from "@auth0/nextjs-auth0";

export class AuthenticationError extends Error {
  constructor() {
    super("Not authenticated");
    this.name = "AuthenticationError";
  }
}

export async function getUserIdForSsc(): Promise<string> {
  try {
    const session = await getSession();

    if (!session) {
      throw new AuthenticationError();
    }

    return session.user.app_uuid;
  } catch (error) {
    console.error("getAuthenticatedUserId Error:", error);
    throw error instanceof AuthenticationError
      ? error
      : new Error("Failed to get user ID");
  }
}
