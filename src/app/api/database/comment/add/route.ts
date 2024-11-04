import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "@/app/util/supabase";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) throw new Error("sessionが取得できません");

    // リクエストボディを解析
    const body = await req.json(); // .text()ではなく.json()を使用

    const user_id = session.user?.app_uuid;
    // bodyから直接必要な値を取得
    const { thread_id, song_id, content } = body;

    // 入力値の検証
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "コメントを入力してください" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("comment")
      .insert([
        {
          user_id,
          thread_id,
          song_id,
          content,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          error: error.message,
          details: error,
          hint: "Database operation failed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Successfully registered", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
