import { getAccessTokenByCookie } from "@/app/actions/spotify";

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
export async function getPlaylists(playlist_id: string) {
  try {
    const token = await getAccessTokenByCookie();

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=50`,
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
    return tracks;
  } catch (error) {
    console.error("Error fetching playlists data:", error);
    throw error;
  }
}
