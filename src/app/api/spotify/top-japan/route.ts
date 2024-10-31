import { getAccessToken } from "@/app/util/getSpotifyAcessToken";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = await getAccessToken();

    // 日本のトップ50プレイリストのID
    const JAPAN_TOP_50_PLAYLIST_ID = "37i9dQZEVXbKXQ4mDTEBXq";

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${JAPAN_TOP_50_PLAYLIST_ID}/tracks?limit=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Japan Top 50");
    }

    const data = await response.json();

    // プレイリストのトラック情報を整形
    const tracks = data.items.map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists.map((artist: any) => artist.name).join(", "),
      album: item.track.album.name,
      image: item.track.album.images[0]?.url,
      preview_url: item.track.preview_url,
      external_url: item.track.external_urls.spotify,
    }));

    return NextResponse.json(tracks);
  } catch (error: any) {
    console.error("Error fetching tracks:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
