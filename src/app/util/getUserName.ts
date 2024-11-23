// utils/user.ts
import { getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "@/app/util/supabase";

interface User {
  id: string;
  name: string;
}

export async function getUserName(userId: string): Promise<User | null> {
  try {
    // 認証チェック
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("user")
      .select("id, name")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to fetch user data");
    }

    if (!data) {
      console.log("User not found:", userId);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
    };
  } catch (error) {
    console.error("getUserById Error:", error);
    throw error;
  }
}
