"use client"

import Image from "next/image"
import type React from "react"
import { useState, useRef, useEffect } from "react"

// Define the structure of the song data prop
interface SongData {
  albumArtUrl: string
  title: string
  artist: string
  progressMs: number
  durationMs: number
  isPlaying: boolean // To potentially show a pause icon or different state
  lastPlayed?: string | null // ISO string for last played time
  albumUrl?: string
  trackUrl?: string
  artistUrls?: string[]
  artistNames?: string[]
  profileUrl?: string
}

interface SpotifyNowPlayingProps {
  songData: SongData | null // Allow null if no song is playing or data isn't loaded
}

// Flat monochrome Spotify logo SVG (smaller, black lines)
const SpotifyFlatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="12" fill="#b3b3b3" />
    <path d="M17.25 16.13a.75.75 0 0 1-1.03.23c-2.82-1.73-6.38-2.12-10.59-1.17a.75.75 0 1 1-.33-1.47c4.57-1.03 8.5-.6 11.6 1.25.36.22.47.69.23 1.03zm1.47-2.93a.94.94 0 0 1-1.29.29c-3.23-1.98-8.16-2.56-11.98-1.41a.94.94 0 1 1-.54-1.81c4.23-1.27 9.57-.64 13.18 1.54.44.27.58.85.29 1.29zm.16-2.98c-3.7-2.19-9.85-2.39-13.36-1.5a1.13 1.13 0 1 1-.52-2.2c3.97-.94 10.7-.71 14.87 1.7a1.13 1.13 0 0 1-1.13 1.96z" fill="#111"/>
  </svg>
)

// Three dots icon
const MoreHorizontalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
)

export default function SpotifyNowPlaying({ songData }: SpotifyNowPlayingProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  if (!songData) {
    return (
      <div className="w-full max-w-xs p-4 bg-[#28152c] rounded-lg text-white font-sans shadow-lg flex flex-col items-center justify-center min-h-[120px]">
        <svg className="animate-spin h-6 w-6 text-gray-300 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-center text-gray-400">Loading activity...</p>
      </div>
    )
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatDateTime = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const progressPercentage = (songData.progressMs / songData.durationMs) * 100

  // If not playing, but lastPlayed is present, show 'Last played' info
  if (!songData.isPlaying && songData.lastPlayed) {
    return (
      <div className="w-full max-w-xs p-4 bg-[#28152c] rounded-lg text-white font-sans shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <SpotifyFlatIcon className="w-3.5 h-3.5" />
            Last played on Spotify
          </div>
          <div className="relative" ref={menuRef}>
            <button aria-label="More options" className="text-gray-400 hover:text-white" onClick={() => setMenuOpen((v) => !v)}>
              <MoreHorizontalIcon />
            </button>
            {menuOpen && songData.profileUrl && (
              <div className="absolute right-0 mt-2 w-36 bg-[#2d1a36] rounded shadow-lg z-10">
                <a
                  href={songData.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#3a2342] rounded"
                  onClick={() => setMenuOpen(false)}
                >
                  Visit Profile
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <a href={songData.albumUrl} target="_blank" rel="noopener noreferrer">
              <Image
                src={songData.albumArtUrl || "/placeholder.svg?width=80&height=80&text=Album+Art"}
                alt={`Album art for ${songData.title}`}
                width={72}
                height={72}
                className="rounded-md aspect-square object-cover hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold truncate" title={songData.title}>
              <a href={songData.trackUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {songData.title}
              </a>
            </h2>
            <p className="text-xs text-gray-400 truncate" title={songData.artist}>
              {songData.artistNames && songData.artistUrls
                ? songData.artistNames.map((name, i) => (
                    <span key={i}>
                      <a
                        href={songData.artistUrls![i]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {name}
                      </a>
                      {i < songData.artistNames!.length - 1 ? ", " : ""}
                    </span>
                  ))
                : songData.artist}
            </p>
            <div className="mt-2">
              <div className="flex justify-between items-center text-xs text-gray-400 mb-0.5">
                <span>{formatTime(songData.durationMs)}</span>
                <span>Played at</span>
              </div>
              <div className="text-xs text-gray-300">{formatDateTime(songData.lastPlayed)}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default: currently playing
  return (
    <div className="w-full max-w-xs p-4 bg-[#28152c] rounded-lg text-white font-sans shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <SpotifyFlatIcon className="w-3.5 h-3.5" />
          Listening to Spotify
        </div>
        <div className="relative" ref={menuRef}>
          <button aria-label="More options" className="text-gray-400 hover:text-white" onClick={() => setMenuOpen((v) => !v)}>
            <MoreHorizontalIcon />
          </button>
          {menuOpen && songData.profileUrl && (
            <div className="absolute right-0 mt-2 w-36 bg-[#2d1a36] rounded shadow-lg z-10">
              <a
                href={songData.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm text-white hover:bg-[#3a2342] rounded"
                onClick={() => setMenuOpen(false)}
              >
                Visit Profile
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <a href={songData.albumUrl} target="_blank" rel="noopener noreferrer">
            <Image
              src={songData.albumArtUrl || "/placeholder.svg?width=80&height=80&text=Album+Art"}
              alt={`Album art for ${songData.title}`}
              width={72}
              height={72}
              className="rounded-md aspect-square object-cover hover:opacity-80 transition-opacity"
            />
          </a>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold truncate" title={songData.title}>
            <a href={songData.trackUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {songData.title}
            </a>
          </h2>
          <p className="text-xs text-gray-400 truncate" title={songData.artist}>
            {songData.artistNames && songData.artistUrls
              ? songData.artistNames.map((name, i) => (
                  <span key={i}>
                    <a
                      href={songData.artistUrls![i]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {name}
                    </a>
                    {i < songData.artistNames!.length - 1 ? ", " : ""}
                  </span>
                ))
              : songData.artist}
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