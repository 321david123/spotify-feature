import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Try to get currently playing track
  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 204 || res.status === 200 && !(await res.clone().json()).item) {
    // No content, nothing is playing, or no item in response
    // Fetch most recently played track
    const recentRes = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!recentRes.ok) {
      return NextResponse.json({ isPlaying: false, error: "Could not fetch recently played" }, { status: recentRes.status });
    }
    const recentData = await recentRes.json();
    const lastTrack = recentData.items?.[0];
    if (!lastTrack) {
      return NextResponse.json({ isPlaying: false, lastPlayed: null });
    }
    const songData = {
      albumArtUrl: lastTrack.track.album.images[0]?.url || "",
      title: lastTrack.track.name,
      artist: lastTrack.track.artists.map((a: any) => a.name).join(", "),
      progressMs: lastTrack.track.duration_ms,
      durationMs: lastTrack.track.duration_ms,
      isPlaying: false,
      lastPlayed: lastTrack.played_at,
    };
    return NextResponse.json(songData);
  }

  if (!res.ok) {
    return NextResponse.json({ error: "Spotify API error", status: res.status }, { status: res.status });
  }

  const data = await res.json();
  if (!data.item) {
    return NextResponse.json({ isPlaying: false });
  }

  const songData = {
    albumArtUrl: data.item.album.images[0]?.url || "",
    title: data.item.name,
    artist: data.item.artists.map((a: any) => a.name).join(", "),
    progressMs: data.progress_ms,
    durationMs: data.item.duration_ms,
    isPlaying: data.is_playing,
    lastPlayed: null,
  };

  return NextResponse.json(songData);
} 