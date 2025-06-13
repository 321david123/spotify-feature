"use client"

import { useEffect, useRef, useState } from "react"
import SpotifyWidget from "../spotify-widget"

// Define the structure of the song data
interface SongData {
  albumArtUrl: string
  title: string
  artist: string
  progressMs: number
  durationMs: number
  isPlaying: boolean
  lastPlayed?: string
}

export default function DashboardPage() {
  const [songData, setSongData] = useState<SongData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progressMs, setProgressMs] = useState<number>(0)
  const rafRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(Date.now())
  const firstLoad = useRef(true)

  // Poll the API every 1 second
  useEffect(() => {
    const fetchSong = async () => {
      if (firstLoad.current) setIsLoading(true)
      try {
        const res = await fetch("/api/spotify/currently-playing")
        const data = await res.json()
        if (data && (data.isPlaying || data.lastPlayed)) {
          setSongData(data)
          setProgressMs(data.progressMs)
          if (data.isPlaying) lastUpdateRef.current = Date.now()
        } else {
          setSongData(null)
        }
      } catch (err) {
        setError("Failed to fetch now playing data.")
        setSongData(null)
      } finally {
        if (firstLoad.current) {
          setIsLoading(false)
          firstLoad.current = false
        }
      }
    }
    fetchSong()
    const interval = setInterval(fetchSong, 1000)
    return () => clearInterval(interval)
  }, [])

  // Smoothly update progress bar locally
  useEffect(() => {
    if (!songData || !songData.isPlaying) return
    let running = true
    const update = () => {
      if (!running) return
      const now = Date.now()
      const elapsed = now - lastUpdateRef.current
      lastUpdateRef.current = now
      setProgressMs((prev) => {
        const next = prev + elapsed
        return next > songData.durationMs ? songData.durationMs : next
      })
      rafRef.current = requestAnimationFrame(update)
    }
    rafRef.current = requestAnimationFrame(update)
    return () => {
      running = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [songData?.isPlaying, songData?.durationMs])

  // Compose the data to pass to the widget
  const widgetData = songData
    ? { ...songData, progressMs }
    : null

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Spotify Activity</h1>
      {isLoading && <p className="text-white">Loading your music...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}
      {!isLoading && !error && <SpotifyWidget songData={widgetData} />}

      {/* You could add a logout button here */}
      {/* <button
        onClick={async () => {
          // Call your /api/auth/logout route
          // Redirect to home page
        }}
        className="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button> */}
    </main>
  )
}
