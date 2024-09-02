<script setup lang="ts"></script>

<template>
  <main>
    <h1>Playlists</h1>
    <PlaylistGrid />
  </main>
</template>

<script setup lang="ts">
import PlaylistGrid from '@/components/PlaylistGrid.vue'
</script>

<style scoped>
main {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}
</style>
