import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "@/app/util/supabase";
import { categoryList } from "@/data/category";

// バリデーション用の型定義
interface ThreadData {
  title: string;
  category: string;
  track_id: string;
  user_id: string;
  emoji: string;
}

// バリデーション用の関数
function validateThreadData(data: Partial<ThreadData>): {
  isValid: boolean;
  error?: string;
} {
  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim() === ""
  ) {
    return {
      isValid: false,
      error: "タイトルは必須です",
    };
  }
  const validCategories = categoryList.map((category) => category.value);
  if (
    !data.category ||
    typeof data.category !== "string" ||
    !validCategories.includes(data.category)
  ) {
    return {
      isValid: false,
      error: "有効なカテゴリーを選択してください",
    };
  }
  if (
    !data.emoji ||
    typeof data.emoji !== "string" ||
    data.emoji.trim() === ""
  ) {
    return {
      isValid: false,
      error: "絵文字は必須です",
    };
  }

  return { isValid: true };
}
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  try {
    const supabase = getSupabase();

    const session = await getSession();
    console.log("Full session:", JSON.stringify(session, null, 2));

    if (!session) {
      return NextResponse.json(
        { error: "認証エラー", details: "セッションが見つかりません" },
        { status: 401 }
      );
    }

    let threadData: Partial<ThreadData>;

    try {
      const rawBody = await req.text();
      const body = JSON.parse(rawBody);

      threadData = {
        user_id: session.user?.app_uuid,
        title: body.title?.trim(),
        category: body.category,
        track_id: body.trackId,
        emoji: body.emoji?.trim(), // emoji追加
      };

      console.log("Parsed data:", threadData);
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

    // バリデーションチェック
    const validation = validateThreadData(threadData);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "バリデーションエラー",
          details: validation.error,
        },
        { status: 400 }
      );
    }

    // track_idの存在確認（オプション）
    if (!threadData.track_id) {
      return NextResponse.json(
        {
          error: "バリデーションエラー",
          details: "track_idは必須です",
        },
        { status: 400 }
      );
    }

    console.log("Attempting to insert data into Supabase");
    const { data, error } = await supabase
      .from("thread")
      .insert([threadData as ThreadData])
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
      {
        message: "Successfully registered",
        data,
      },
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
