"use client"

import Image from "next/image"
import type React from "react"

// Define the structure of the song data prop
interface SongData {
  albumArtUrl: string
  title: string
  artist: string
  progressMs: number
  durationMs: number
  isPlaying: boolean // To potentially show a pause icon or different state
}

interface SpotifyWidgetProps {
  songData: SongData | null // Allow null if no song is playing or data isn't loaded
}

// A generic Spotify icon (replace with a more accurate one if desired)
const SpotifyBrandIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.72 14.12c-.16.24-.48.32-.72.16-.24-.16-.32-.48-.16-.72l1.44-2.16c1.44-2.16.8-5.04-1.2-6.24-2.16-1.2-4.92-.84-6.36 1.08-1.44 1.92-1.08 4.68.72 6.24.24.24.24.6.04.88-.24.24-.6.24-.88.04-2.16-1.92-2.64-5.04-1.08-7.56 1.56-2.52 4.8-3.36 7.56-1.8 2.76 1.56 3.6 5.04 1.92 7.8l-1.28 1.92zM7.92 12.4c-.24-.12-.52.04-.64.32-.12.24.04.52.32.64 1.44.72 3.12.84 4.56.32.24-.08.4-.32.32-.56s-.32-.4-.56-.32c-1.2.4-2.64.32-3.84-.24-.08 0-.12-.04-.16-.16zm.04-1.68c-.24-.12-.52.04-.64.32s.04.52.32.64c1.2.6 2.64.68 3.92.24.24-.08.4-.32.32-.56s-.32-.4-.56-.32c-1.08.32-2.28.28-3.36-.32z" />
  </svg>
)

// More Options Icon (three dots)
const MoreHorizontalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
)

export default function SpotifyWidget({ songData }: SpotifyWidgetProps) {
  if (!songData) {
    return (
      <div className="w-full max-w-xs p-4 bg-[#28152c] rounded-lg text-white font-sans shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <SpotifyBrandIcon className="text-gray-400" />
            Listening to Spotify
          </div>
        </div>
        <p className="text-center text-gray-400">Nothing playing right now.</p>
      </div>
    )
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = (songData.progressMs / songData.durationMs) * 100

  return (
    <div className="w-full max-w-xs p-4 bg-[#28152c] rounded-lg text-white font-sans shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <SpotifyBrandIcon className="text-gray-400" />
          Listening to Spotify
        </div>
        <button aria-label="More options" className="text-gray-400 hover:text-white">
          <MoreHorizontalIcon />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Image
            src={songData.albumArtUrl || "/placeholder.svg?width=80&height=80&text=Album+Art"}
            alt={`Album art for ${songData.title}`}
            width={72}
            height={72}
            className="rounded-md aspect-square object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold truncate" title={songData.title}>
            {songData.title}
          </h2>
          <p className="text-xs text-gray-400 truncate" title={songData.artist}>
            {songData.artist}
          </p>
          <div className="mt-2">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-0.5">
              <span>{formatTime(songData.progressMs)}</span>
              <span>{formatTime(songData.durationMs)}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1">
              <div className="bg-white h-1 rounded-full" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
