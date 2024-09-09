import { defineStore } from 'pinia'
import axios from 'axios'

interface Song {
  title: string
  artist: string
  album: string
  cover: string
  duration: number
  playback_start_time?: number
  url?: string
}

interface ServerSong {
  serverId: string
  name: string
  icon: string | null
  song: Song | null
  queue: Song[]
  history: Song[]
}

export const usePlayerStore = defineStore('player', {
  state: () => ({
    isPlaying: false,
    currentSong: null as Song | null,
    serverSongs: [] as ServerSong[],
    selectedServerId: null as string | null,
    volume: 100,
    isQueueOpen: false,
    queue: [] as Song[],
    history: [] as Song[]
  }),
  actions: {
    updateServerSong(
      serverId: string,
      song: Song | null,
      queue: Song[],
      history: Song[],
      name: string,
      icon: string | null
    ) {
      const index = this.serverSongs.findIndex((ss) => ss.serverId === serverId)
      if (index !== -1) {
        this.serverSongs[index] = { serverId, song, queue, history, name, icon }
      } else {
        this.serverSongs.push({ serverId, song, queue, history, name, icon })
      }

      if (serverId === this.selectedServerId) {
        this.currentSong = song
        this.queue = queue
        this.history = history
        this.isPlaying = !!song
      }
    },
    setSelectedServer(serverId: string) {
      this.selectedServerId = serverId
      const serverSong = this.serverSongs.find((ss) => ss.serverId === serverId)
      if (serverSong) {
        this.currentSong = serverSong.song
        this.queue = serverSong.queue
        this.history = serverSong.history
        this.isPlaying = !!serverSong.song
      } else {
        this.currentSong = null
        this.queue = []
        this.isPlaying = false
      }
    },
    clearSelectedServer() {
      this.selectedServerId = null
      this.currentSong = null
      this.isPlaying = false
    },
    async togglePlayPause() {
      if (!this.selectedServerId) {
        return
      }
      await axios.post(
        'http://localhost:8000/api/playback/toggle',
        { guildId: this.selectedServerId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      this.isPlaying = !this.isPlaying
    },
    playbackFinished() {
      this.isPlaying = false
      if (this.selectedServerId) {
        const serverSong = this.serverSongs.find((ss) => ss.serverId === this.selectedServerId)
        if (serverSong) {
          this.updateServerSong(
            this.selectedServerId,
            null,
            serverSong.queue,
            serverSong.history,
            serverSong.name,
            serverSong.icon
          )
        }
      }
    },
    clearAllServerSongs() {
      this.serverSongs = []
      this.currentSong = null
      this.isPlaying = false
      this.selectedServerId = null
    },
    async seekToPosition(position: number) {
      if (!this.selectedServerId || !this.currentSong) {
        return
      }

      try {
        await axios.post(
          'http://localhost:8000/api/playback/seek',
          {
            guildId: this.selectedServerId,
            position: position
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )

        // Update the local state
        if (this.currentSong) {
          this.currentSong.playback_start_time = Date.now() - position * 1000
        }
      } catch (error) {
        console.error('Error seeking to position:', error)
        // Handle the error appropriately (e.g., show a notification to the user)
      }
    },
    toggleQueue() {
      this.isQueueOpen = !this.isQueueOpen
    },
    setVolume(volume: number) {
      this.volume = volume
      // if (this.selectedServerId) {
      //   axios.post(
      //     'http://localhost:8000/api/playback/volume',
      //     { guildId: this.selectedServerId, volume },
      //     {
      //       headers: {
      //         'Content-Type': 'application/json',
      //         Authorization: `Bearer ${localStorage.getItem('token')}`
      //       }
      //     }
      //   )
      // }
    }
  }
})
