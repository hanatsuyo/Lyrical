import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { getSupabase } from "@/app/util/server/supabase";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    // リクエストパラメータのログ
    console.log("Requested user_id:", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "user_idが指定されていません" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // 実行されるクエリの内容をログ
    console.log("Executing query for user:", {
      table: "user",
      column: "id",
      value: userId,
    });

    const { data, error } = await supabase
      .from("user")
      .select("id, name") // idも含めて取得してデバッグ
      .eq("id", userId)
      .single();

    // クエリ結果の詳細ログ
    console.log("Query result:", {
      success: !error,
      hasData: !!data,
      data,
      error,
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          error: "データの取得に失敗しました",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      // データが見つからない場合の詳細なレスポンス
      return NextResponse.json(
        {
          error: "ユーザーが見つかりません",
          requestedId: userId,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        name: data.name,
        id: data.id, // 確認用
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
