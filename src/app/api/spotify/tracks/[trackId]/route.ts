import { getAccessToken } from "@/app/util/getSpotifyAcessToken";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { trackId: string } }
) {
  const { trackId } = params;

  if (!trackId) {
    return NextResponse.json(
      { error: "Track ID is required" },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getAccessToken();
    console.log(trackId);
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
      return NextResponse.json(
        { error: `Spotify API Error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching track data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
