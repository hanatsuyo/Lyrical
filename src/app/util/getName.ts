// app/util/getName.ts

export async function getNameById(userId: string): Promise<string | null> {
  try {
    // デバッグ用にユーザーIDをログ出力
    console.log("Fetching name for userId:", userId);

    // パスを修正
    const response = await fetch(`/api/user/get/nameById?user_id=${userId}`);

    if (!response.ok) {
      console.error("Failed to fetch user name:", response.statusText);
      // エラーレスポンスの詳細をログ出力
      const errorData = await response.json().catch(() => ({}));
      console.error("Error details:", errorData);
      return null;
    }

    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error("Error fetching user name:", error);
    return null;
  }
}
