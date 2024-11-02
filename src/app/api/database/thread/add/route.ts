import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "@/app/util/supabase";

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();

    const session = await getSession();
    console.log("Full session:", JSON.stringify(session, null, 2));

    if (!session) throw new Error("sessionが取得できません");

    let title, user_id, track_id, category;

    try {
      const rawBody = await req.text();

      const body = JSON.parse(rawBody);

      user_id = session.user?.app_uuid;
      title = body.title;
      category = body.category;
      track_id = body.trackId;

      console.log("Parsed data:", { user_id, title, category, track_id });
    } catch (e) {
      console.error("Error processing request:", e);
      return NextResponse.json(
        {
          error: "データ処理エラー",
          details: e instanceof Error ? e.message : "Unknown error",
          sessionData: session?.user?.app_metadata,
        },
        { status: 400 }
      );
    }

    // 入力値の検証
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
    }

    console.log("Attempting to insert data into Supabase");
    const { data, error } = await supabase
      .from("thread")
      .insert([
        {
          user_id,
          title,
          track_id,
          category,
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
    console.error("Detailed error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
