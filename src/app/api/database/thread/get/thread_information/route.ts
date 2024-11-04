// app/api/threads/route.ts
import { getSupabase } from "@/app/util/supabase";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const thread_id = searchParams.get("thread_id");

    if (!thread_id) {
      return NextResponse.json(
        { error: "thread_id is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("thread")
      .select()
      .eq("thread_id", thread_id)
      .maybeSingle();

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
