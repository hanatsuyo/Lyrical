// utils/spotify.ts
import { getAccessToken } from "@/app/actions/spotify";
import { SpotifyTrack } from "@/types/track";
export async function getTrack(trackId: string): Promise<SpotifyTrack> {
  if (!trackId) {
    throw new Error("Track ID is required");
  }

  try {
    const accessToken = await getAccessToken();
    // console.log(accessToken);
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
