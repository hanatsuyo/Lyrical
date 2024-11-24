// app/api/database/thread/delete/route.ts
import { getSupabase } from "@/app/util/server/supabase";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

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
