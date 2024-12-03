// app/api/database/thread/delete/route.ts
import { getSupabase } from "@/app/util/server/supabase";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { categoryList } from "@/data/category";

interface ThreadData {
  title: string;
  category: string;
  track_id: string;
  user_id: string;
  emoji: string;
}

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
export const revalidate = 0;

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
    let query = supabase.from("thread").select("*").eq("track_id", trackId);

    // categoryがall以外の場合のみ、カテゴリーで絞り込む
    if (category !== "all") {
      query = query.eq("category", category);
    }

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

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { thread_id } = await request.json();
    if (!thread_id) {
      return NextResponse.json(
        { error: "Thread ID is required" },
        { status: 400 }
      );
    }

    const user_id = session.user.app_uuid;
    const supabase = getSupabase();

    // トランザクション的な処理のために、まずスレッドの所有者を確認
    const { data: threadData, error: threadCheckError } = await supabase
      .from("thread")
      .select("thread_id")
      .eq("thread_id", thread_id)
      .eq("user_id", user_id)
      .single();

    if (threadCheckError || !threadData) {
      console.error("Thread check error:", threadCheckError);
      return NextResponse.json(
        { error: "Thread not found or unauthorized" },
        { status: 404 }
      );
    }

    // コメントを先に削除
    const { error: commentsDeleteError } = await supabase
      .from("comment")
      .delete()
      .eq("thread_id", thread_id);

    if (commentsDeleteError) {
      console.error("Comments delete error:", commentsDeleteError);
      return NextResponse.json(
        { error: "Failed to delete comments" },
        { status: 500 }
      );
    }

    // スレッドを削除
    const { error: threadDeleteError } = await supabase
      .from("thread")
      .delete()
      .eq("thread_id", thread_id)
      .eq("user_id", user_id);

    if (threadDeleteError) {
      console.error("Thread delete error:", threadDeleteError);
      return NextResponse.json(
        { error: "Failed to delete thread" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thread and all associated comments have been deleted",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
