<template>
  <div>Processing authentication...</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { handleAuthCallback } from '../utils/handleAuthCallback'

onMounted(async () => {
  await handleAuthCallback()
})
</script>
