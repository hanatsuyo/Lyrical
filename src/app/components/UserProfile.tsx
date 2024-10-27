import { getUserId } from "@/app/util/getUserId";
import { getSupabase } from "@/app/util/supabase";
import Link from "next/link";

export default async function UserProfile() {
  let userName: string | null = null;
  async function fetchUserName(id: string): Promise<string | null> {
    const supabase = getSupabase();

    try {
      const { data, error } = await supabase
        .from("user")
        .select("name")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        return null;
      }

      return data?.name || null;
    } catch (error) {
      console.error("Error in fetchUserName:", error);
      return null;
    }
  }

  try {
    const id = await getUserId();
    if (id) {
      userName = await fetchUserName(id);
    }
  } catch (error) {
    console.error("Error in Header:", error);
  }
  return (
    <>
      <a href="/api/auth/logout" className="text-white">
        ログアウト
      </a>
      <Link href="/dashboard/add/">新規追加</Link>
      <div>
        <p>{userName}</p>
      </div>
    </>
  );
}
