// app/api/threads/route.ts
import { getSupabase } from "@/app/util/server/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = getSupabase();
    const query = supabase
      .from("thread")
      .select("*")
      .order("created_at", { ascending: false }) // 作成日時の降順（最新順）
      .limit(9); // 9件に制限

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
