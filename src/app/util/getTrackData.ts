export async function getTrackData(trackId: string) {
  try {
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
      // APIエラーの詳細をログに記録
      console.error(`Spotify API Error: ${response.status}`);
      throw new Error(`Failed to fetch track data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // エラーの詳細をログに記録
    console.error("Error fetching track data:", error);
    throw error;
  }
}
