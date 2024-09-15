import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosInstance } from 'axios'

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

interface State {
  isPlaying: boolean
  currentSong: Song | null
  serverSongs: ServerSong[]
  selectedServerId: string | null
  volume: number
  isQueueOpen: boolean
  queue: Song[]
  history: Song[]
  loopMode: LoopMode
  isShuffleActive: boolean
}

enum LoopMode {
  NoLoop = 'noLoop',
  LoopAll = 'loopAll',
  LoopOne = 'loopOne'
}

// Base axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'https://app.ugoku.moe/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const usePlayerStore = defineStore('player', {
  state: (): State => ({
    isPlaying: false,
    currentSong: null as Song | null,
    serverSongs: [] as ServerSong[],
    selectedServerId: null as string | null,
    volume: 100,
    isQueueOpen: false,
    queue: [] as Song[],
    history: [] as Song[],
    loopMode: LoopMode.NoLoop,
    isShuffleActive: false
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
    async togglePlayPause(): Promise<void> {
      if (!this.selectedServerId) return
      try {
        await api.post('/playback/toggle', { guildId: this.selectedServerId })
        this.isPlaying = !this.isPlaying
      } catch (error) {
        console.error('Error toggling play/pause:', error)
      }
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
        await api.post('/playback/seek', {
          guildId: this.selectedServerId,
          position: position
        })

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
    async setLoopMode(mode: LoopMode) {
      try {
        await api.post('/playback/loop', {
          guildId: this.selectedServerId,
          mode: mode
        })
        this.loopMode = mode
      } catch (error) {
        console.error('Error setting loop mode:', error)
      }
    },
    async toggleLoopMode() {
      const modes = ['noLoop', 'loopAll', 'loopOne']
      const currentIndex = modes.indexOf(this.loopMode)
      const newMode = modes[(currentIndex + 1) % modes.length] as LoopMode
      await this.setLoopMode(newMode)
    },
    async skipSong() {
      if (!this.selectedServerId) return
      try {
        await api.post('/playback/skip', { guildId: this.selectedServerId })
      } catch (error) {
        console.error('Error skipping song:', error)
      }
    },
    async toggleShuffle(isActive: boolean) {
      if (!this.selectedServerId) return
      try {
        await api.post('/playback/shuffle', { guildId: this.selectedServerId, isActive })
        this.isShuffleActive = isActive
      } catch (error) {
        console.error('Error shuffling queue:', error)
      }
    },
    async playPrevious() {
      if (!this.selectedServerId) return
      try {
        await api.post('/playback/previous', {
          guildId: this.selectedServerId
        })
      } catch (error) {
        console.error('Error playing previous song:', error)
      }
    },
    async setVolume(volume: number) {
      if (!this.selectedServerId) return
      try {
        await api.post('/playback/volume', { guildId: this.selectedServerId, volume })
        this.volume = volume
      } catch (error) {
        console.error('Error shuffling queue:', error)
      }
    }
  }
})
