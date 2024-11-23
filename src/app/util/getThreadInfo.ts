// utils/thread.ts
import { getSupabase } from "@/app/util/supabase";

interface Thread {
  thread_id: string;
  category: string;
  title: string;
  content: string;
  created_at: string;
  // etc...
}

export async function getThreadInfo(threadId: string): Promise<Thread | null> {
  try {
    if (!threadId) {
      throw new Error("thread_id is required");
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("thread")
      .select()
      .eq("thread_id", threadId)
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("getThread Error:", error);
    throw error;
  }
}
