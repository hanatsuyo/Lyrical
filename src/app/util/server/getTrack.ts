// utils/spotify.ts
import { getAccessToken } from "@/app/util/server/getSpotifyAcessToken";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  external_urls: {
    spotify: string;
  };
}

export async function getTrack(trackId: string): Promise<SpotifyTrack> {
  if (!trackId) {
    throw new Error("Track ID is required");
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching track data:", error);
    throw error;
  }
}
