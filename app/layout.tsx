import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Spotify Now Playing", 
  description: "See what's currently playing on Spotify.",
  // You can also add an 'icons' property for favicons:
  // icons: {
  //   icon: '/favicon.ico', // Default icon
  //   apple: '/apple-touch-icon.png', // For Apple devices
  //   shortcut: '/favicon-16x16.png', // Or other sizes
  // },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
