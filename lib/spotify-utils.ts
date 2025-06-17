/**
 * Utility functions for Spotify Artist Widget integration
 */

/**
 * Validates and formats an artist name for the Spotify API
 * @param artistName - The artist name to validate
 * @returns Formatted artist name or null if invalid
 */
export function validateArtistName(artistName: string): string | null {
  if (!artistName || typeof artistName !== 'string') {
    return null
  }
  
  const trimmed = artistName.trim()
  if (trimmed.length === 0 || trimmed.length > 100) {
    return null
  }
  
  return trimmed
}

/**
 * Creates a list of popular artists for easy testing
 * @returns Array of popular artist names
 */
export function getPopularArtists(): string[] {
  return [
    'Nicky Jam',
    'Bad Bunny',
    'Taylor Swift',
    'Drake',
    'The Weeknd',
    'Ed Sheeran',
    'Tyga',
    'Arcángel',
    'Soulja Boy',
    'DJ Luian',
    'Jay Wheeler',
    'Post Malone',
    'Ariana Grande',
    'Billie Eilish',
    'Dua Lipa'
  ]
}

/**
 * Creates a list of Latin artists
 * @returns Array of Latin artist names
 */
export function getLatinArtists(): string[] {
  return [
    'Nicky Jam',
    'Bad Bunny',
    'J Balvin',
    'Maluma',
    'Ozuna',
    'Anuel AA',
    'Arcángel',
    'DJ Luian',
    'Jay Wheeler',
    'Rauw Alejandro',
    'Myke Towers',
    'Sech',
    'Feid',
    'Karol G',
    'Becky G'
  ]
}

/**
 * Creates a list of hip-hop artists
 * @returns Array of hip-hop artist names
 */
export function getHipHopArtists(): string[] {
  return [
    'Drake',
    'Post Malone',
    'Travis Scott',
    'Kendrick Lamar',
    'J. Cole',
    'Eminem',
    'Tyga',
    'Soulja Boy',
    'Lil Baby',
    'DaBaby',
    'Megan Thee Stallion',
    'Cardi B',
    'Nicki Minaj',
    '21 Savage',
    'Lil Uzi Vert'
  ]
}

/**
 * Generates a random artist name from the popular artists list
 * @returns Random artist name
 */
export function getRandomArtist(): string {
  const artists = getPopularArtists()
  return artists[Math.floor(Math.random() * artists.length)]
}

/**
 * Formats artist name for display (capitalizes properly)
 * @param artistName - The artist name to format
 * @returns Formatted artist name
 */
export function formatArtistName(artistName: string): string {
  return artistName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Creates a simple artist widget configuration
 * @param artistName - The artist name
 * @param options - Optional configuration
 * @returns Widget configuration object
 */
export function createArtistWidgetConfig(
  artistName: string, 
  options: {
    showSeeMore?: boolean
    initialTrackCount?: number
    showPreviews?: boolean
    className?: string
  } = {}
) {
  return {
    artistName: validateArtistName(artistName) || artistName,
    showSeeMore: options.showSeeMore ?? true,
    initialTrackCount: options.initialTrackCount ?? 5,
    showPreviews: options.showPreviews ?? true,
    className: options.className || ''
  }
}

/**
 * Type definitions for easy integration
 */
export interface SpotifyArtistWidgetConfig {
  artistName: string
  className?: string
  apiEndpoint?: string
  showSeeMore?: boolean
  initialTrackCount?: number
  showPreviews?: boolean
  loadingMessage?: string
  errorMessage?: string
}

/**
 * Creates multiple artist widget configurations
 * @param artistNames - Array of artist names
 * @param baseConfig - Base configuration to apply to all widgets
 * @returns Array of widget configurations
 */
export function createMultipleArtistWidgets(
  artistNames: string[],
  baseConfig: Partial<SpotifyArtistWidgetConfig> = {}
): SpotifyArtistWidgetConfig[] {
  return artistNames
    .map(name => validateArtistName(name))
    .filter((name): name is string => name !== null)
    .map(artistName => ({
      artistName,
      ...baseConfig
    }))
} 