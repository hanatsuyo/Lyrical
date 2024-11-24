import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "@/app/util/server/supabase";

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();

    const session = await getSession();
    console.log("Full session:", JSON.stringify(session, null, 2));

    if (!session) throw new Error("sessionが取得できません");

    let name, mail, gender, birthdate, id;

    try {
      const rawBody = await req.text();

      const body = JSON.parse(rawBody);

      // UUIDの取得（ない場合は新規生成）
      id = session.user?.app_uuid;

      if (!id) {
        console.error("Missing UUID in app_metadata:", {
          appMetadata: session.user.app_metadata,
          user: session.user,
        });
        throw new Error("UUIDが設定されていません");
      }

      name = body.name;
      mail = session.user.email;
      gender = body.gender;
      birthdate = body.birthdate;

      console.log("Parsed data:", { id, name, mail, gender, birthdate });
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
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
    }

    if (!gender || typeof gender !== "string") {
      return NextResponse.json({ error: "性別は必須です" }, { status: 400 });
    }

    if (!birthdate || typeof birthdate !== "string") {
      return NextResponse.json(
        { error: "生年月日は必須です" },
        { status: 400 }
      );
    }

    console.log("Attempting to insert data into Supabase");
    const { data, error } = await supabase
      .from("user")
      .insert([
        {
          id,
          name,
          mail,
          gender,
          birthdate,
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
