import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  console.log("LOG: /api/auth/spotify/callback route handler started.")
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  console.log(`LOG: Authorization code from Spotify: ${code ? code.substring(0, 10) + "..." : "MISSING!"}`)

  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
  const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    const errorMessage =
      "Server Configuration Error: One or more Spotify API credentials (client ID, client secret, or redirect URI) are missing. Please ensure all required Spotify environment variables are set."
    console.error("ERROR: " + errorMessage)
    return new NextResponse(errorMessage, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    })
  }
  console.log("LOG: All Spotify API credentials found in environment variables for callback.")

  if (!code) {
    const errorMessage = "Authorization Error: Authorization code not found in callback from Spotify."
    console.error("ERROR: " + errorMessage)
    return new NextResponse(errorMessage, {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    })
  }

  try {
    console.log("LOG: Attempting to exchange authorization code for tokens...")
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
    })
    console.log(`LOG: Spotify token API response status: ${response.status}`)

    const data = await response.json()

    if (!response.ok) {
      console.error("ERROR: Spotify API Error during token exchange:", data)
      return NextResponse.json(
        {
          error: "Spotify API error",
          message: data.error_description || "Failed to fetch access token from Spotify.",
          details: data,
        },
        { status: response.status },
      )
    }

    const { access_token, refresh_token, expires_in } = data
    console.log("LOG: Access Token obtained successfully from Spotify.")

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000"
    const url = new URL(`${baseUrl}/dashboard`)
    console.log(`LOG: Redirecting to dashboard: ${url.pathname}`)

    const responseRedirect = NextResponse.redirect(url)
    // Set HTTP-only cookies for tokens
    responseRedirect.cookies.set("spotify_access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: expires_in, // seconds
    })
    responseRedirect.cookies.set("spotify_refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
    return responseRedirect
  } catch (error) {
    console.error("ERROR: Internal Server Error during Spotify callback processing:", error)
    const message = error instanceof Error ? error.message : "An unknown error occurred during callback processing."
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred during the Spotify callback process.",
        details: message,
      },
      { status: 500 },
    )
  }
}
