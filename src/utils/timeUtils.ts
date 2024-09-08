/**
 * Formats a time in seconds to a string in the format "MM:SS"
 * @param seconds - The time in seconds to format
 * @returns A string representation of the time in "MM:SS" format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Calculates the current position of a song based on its start time
 * @param startTime - The start time of the song playback (ISO string)
 * @param duration - The total duration of the song in seconds
 * @returns The current position in seconds
 */
export function calculateCurrentPosition(startTime: string, duration: number): number {
  const start = new Date(startTime).getTime()
  const now = Date.now()
  const elapsedTime = (now - start) / 1000 // Convert to seconds
  return Math.min(elapsedTime, duration)
}

/**
 * Converts milliseconds to seconds
 * @param ms - Time in milliseconds
 * @returns Time in seconds
 */
export function msToSeconds(ms: number): number {
  return ms / 1000
}

/**
 * Converts seconds to milliseconds
 * @param seconds - Time in seconds
 * @returns Time in milliseconds
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000
}

/**
 * Parses a time string in "MM:SS" format to seconds
 * @param timeString - Time string in "MM:SS" format
 * @returns Time in seconds
 */
export function parseTimeString(timeString: string): number {
  const [minutes, seconds] = timeString.split(':').map(Number)
  return minutes * 60 + seconds
}

/**
 * Formats a date to a string in "YYYY-MM-DD" format
 * @param date - The date to format
 * @returns A string representation of the date in "YYYY-MM-DD" format
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}
