import { defineStore } from 'pinia'
import axios from 'axios'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    isPlaying: false,
    currentSong: {
      title: '',
      artist: '',
      album: '',
      cover: '',
      duration: 0
    }
  }),
  actions: {
    updateCurrentSong(song: {
      title: string
      artist: string
      album: string
      cover: string
      duration: number
    }) {
      this.currentSong = song
    },
    async play() {
      await axios.post('/api/playback/toggle', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          guildId: guildId
        })
      })
      this.isPlaying = true
    },
    pause() {
      this.isPlaying = false
    }
  }
})
