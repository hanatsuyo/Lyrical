// app/api/threads/route.ts
import { getSupabase } from "@/app/util/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const trackId = searchParams.get("trackId");

    if (!category || !trackId) {
      return NextResponse.json(
        { error: "Category and trackId are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("thread")
      .select("*")
      .eq("category", category)
      .eq("track_id", trackId);

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