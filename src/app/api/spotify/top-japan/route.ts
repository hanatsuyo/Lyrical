import { getAccessTokenByCookie } from "@/app/actions/spotify";
import { NextResponse } from "next/server";

// Spotifyのレスポンス用の型定義
interface SpotifyArtist {
  name: string;
}

interface SpotifyAlbumImage {
  url: string;
}

interface SpotifyAlbum {
  name: string;
  images: SpotifyAlbumImage[];
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyPlaylistItem {
  track: SpotifyTrack;
}

interface SpotifyPlaylistResponse {
  items: SpotifyPlaylistItem[];
}

// 整形後のトラック情報の型定義
interface FormattedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string | undefined;
  preview_url: string | null;
  external_url: string;
}
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const token = await getAccessTokenByCookie();

    // 日本のトップ50プレイリストのID
    const JAPAN_TOP_50_PLAYLIST_ID = "54WBnoUJ9oAFo5OCes3SVg";

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

    const data: SpotifyPlaylistResponse = await response.json();

    // プレイリストのトラック情報を整形
    const tracks: FormattedTrack[] = data.items.map((item) => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists.map((artist) => artist.name).join(", "),
      album: item.track.album.name,
      image: item.track.album.images[0]?.url,
      preview_url: item.track.preview_url,
      external_url: item.track.external_urls.spotify,
    }));

    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
