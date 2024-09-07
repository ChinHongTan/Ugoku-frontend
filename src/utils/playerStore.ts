import { defineStore } from 'pinia'
import axios from 'axios'

interface Song {
  title: string
  artist: string
  album: string
  cover: string
  duration: number
  playback_start_time: number
}

interface ServerSong {
  serverId: string
  song: Song | null
}

export const usePlayerStore = defineStore('player', {
  state: () => ({
    isPlaying: false,
    currentSong: null as Song | null,
    serverSongs: [] as ServerSong[],
    selectedServerId: null as string | null,
    volume: 100
  }),
  actions: {
    updateServerSong(serverId: string, song: Song | null) {
      const index = this.serverSongs.findIndex((ss) => ss.serverId === serverId)
      if (index !== -1) {
        this.serverSongs[index].song = song
      } else {
        this.serverSongs.push({ serverId, song })
      }

      if (serverId === this.selectedServerId) {
        this.currentSong = song
        this.isPlaying = !!song
      }
    },
    setSelectedServer(serverId: string) {
      this.selectedServerId = serverId
      const serverSong = this.serverSongs.find((ss) => ss.serverId === serverId)
      this.currentSong = serverSong ? serverSong.song : null
      this.isPlaying = !!this.currentSong
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
        this.updateServerSong(this.selectedServerId, null)
      }
      this.$emit('playbackFinished')
    },
    clearAllServerSongs() {
      this.serverSongs = []
      this.currentSong = null
      this.isPlaying = false
      this.selectedServerId = null
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
