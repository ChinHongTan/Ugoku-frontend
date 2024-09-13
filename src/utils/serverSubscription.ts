import { EventSourcePolyfill } from 'event-source-polyfill'
import { usePlayerStore } from '../store/playerStore'

export function subscribeToActiveServers() {
  const playerStore = usePlayerStore()
  let eventSource: EventSourcePolyfill | null = null

  if (eventSource) return // Prevent multiple connections

  eventSource = new EventSourcePolyfill('http://localhost:8000/play/stream')
  ;(eventSource as any).onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)

      if (data.guilds && data.guilds.length > 0) {
        data.guilds.forEach((guild: any) => {
          const currentSong = guild.currentSong
          const queue = guild.queue || []
          const history = guild.history || []
          playerStore.updateServerSong(
            guild.id,
            currentSong
              ? {
                  title: currentSong.title,
                  artist: currentSong.artist,
                  album: currentSong.album,
                  cover: currentSong.cover,
                  duration: currentSong.duration,
                  playback_start_time: currentSong.playback_start_time
                }
              : null,
            queue,
            history,
            guild.name,
            guild.icon
          )
        })
      } else {
        console.log('No active servers')
        playerStore.clearAllServerSongs()
      }
    } catch (error) {
      console.error('Error parsing SSE data:', error)
    }
  }
  ;(eventSource as any).onerror = (error: Event) => {
    console.error('SSE error:', error)
    eventSource?.close()
    eventSource = null
  }

  return () => {
    eventSource?.close()
  }
}
