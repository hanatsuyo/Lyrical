import { getSupabase } from "@/app/util/server/supabase";
import type { Thread } from "@/app/types/thread";

export async function getLatestThreads(): Promise<Thread[]> {
  try {
    const supabase = getSupabase();
    const query = supabase
      .from("thread")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);

    const { data, error } = await query;

    if (error) {
      throw new Error("Failed to fetch latest threads");
    }

    if (!data) {
      console.log("Threads not found");
    }
    return data;
  } catch (error) {
    throw error;
  }
}
