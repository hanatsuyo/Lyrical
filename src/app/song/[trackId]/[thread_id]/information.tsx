import dayjs from "dayjs";
import { getTrack } from "@/app/util/server/getTrack";
import { getThreadInfo } from "@/app/util/server/getThreadInfo";
import { categoryList } from "@/data/category";

interface InformationProps {
  thread_id: string;
  trackId: string;
}

// カテゴリー取得のヘルパー関数
function getCategory(category: string | undefined) {
  if (!category) return false;
  const foundCategory = categoryList.find((item) => item.value === category);
  return foundCategory ? foundCategory.label : false;
}

export default async function Information({
  thread_id,
  trackId,
}: InformationProps) {
  try {
    // 並列でデータを取得
    const [track, thread] = await Promise.all([
      getTrack(trackId),
      getThreadInfo(thread_id),
    ]);

    if (!track || !thread) {
      throw new Error("Data not found");
    }

    return (
      <>
        {/* Spotify楽曲情報 */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <img
            src={track.album.images[0].url}
            alt={track.album.name}
            width={96}
            height={96}
            className="rounded-md"
          />
          <div>
            <h2 className="font-bold text-lg">{track.name}</h2>
            <p className="text-gray-600">
              {track.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        </div>

        {/* スレッド情報 */}
        <div className="mt-12">
          <h1 className="text-3xl font-bold mt-8">{thread.title}</h1>
          <div className="flex justify-between mt-4">
            {thread.category && (
              <p className="bg-black text-white py-1 px-4 rounded-full">
                {getCategory(thread.category)}
              </p>
            )}
            <p>公開：{dayjs(thread.created_at).format("YYYY年MM月D日")}</p>
          </div>
        </div>
      </>
    );
  } catch (error) {
    return (
      <div className="text-red-500">
        エラーが発生しました:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
}
