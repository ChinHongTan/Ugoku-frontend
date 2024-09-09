<template>
  <div class="page-container">
    <div class="welcome-container">
      <h1>Welcome to Ugoku!</h1>
      <p>Ugoku is a powerful Discord bot for music playback and playlist management.</p>

      <div class="features">
        <h2>Features:</h2>
        <ul>
          <li>Play music from various sources</li>
          <li>Create and manage playlists</li>
          <li>Advanced queue management</li>
          <li>High-quality audio playback</li>
          <li>Shuwi will love you</li>
        </ul>
      </div>

      <div class="cta-buttons">
        <a :href="addToBotUrl" class="btn btn-primary">Add to Server</a>
        <a :href="loginUrl" class="btn btn-secondary">Login with Discord</a>
      </div>
    </div>
    <div class="random-stuff">
      <img src="../assets/yuzuki-smug.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore'

const router = useRouter()
const userStore = useUserStore()

const addToBotUrl = ref(
  'https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=YOUR_PERMISSIONS&scope=bot'
)
const loginUrl = ref(
  'https://discord.com/oauth2/authorize?client_id=958201832528838706&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fdiscord&scope=identify+guilds'
)

onMounted(() => {
  if (userStore.user) {
    router.push('/home')
  }
})
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 40px;
}

.welcome-container {
  flex: 1;
  max-width: 800px;
  padding-right: 40px;
}

.random-stuff {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: var(--color-background-mute);
  border-radius: 10px;
  max-width: 50%;
}

.random-stuff img {
  max-width: 100%; /* Make sure the image doesn't exceed its container */
  height: auto; /* Maintain aspect ratio */
  object-fit: contain; /* Ensure the entire image is visible */
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.features {
  margin-bottom: 40px;
  text-align: left;
}

.features h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
}

.features ul {
  list-style-type: none;
  padding: 0;
}

.features li {
  font-size: 1.1rem;
  margin-bottom: 10px;
  padding-left: 25px;
  position: relative;
}

.features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #4caf50;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  font-size: 1.1rem;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #7289da;
  color: white;
}

.btn-primary:hover {
  background-color: #5b6eae;
}

.btn-secondary {
  background-color: #4caf50;
  color: white;
}

.btn-secondary:hover {
  background-color: #45a049;
}

@media (max-width: 1024px) {
  .page-container {
    flex-direction: column;
  }

  .welcome-container {
    max-width: 100%;
    padding-right: 0;
    margin-bottom: 40px;
  }

  .random-stuff {
    flex: none;
    width: 100%;
    max-width: 100%; /* Allow full width on smaller screens */
  }

  .random-stuff img {
    max-width: 50%; /* Limit image width on smaller screens */
  }
}

@media (max-width: 1024px) {
  .page-wrapper {
    flex-direction: column;
  }

  .welcome-container,
  .random-stuff {
    width: 100%;
  }
}
</style>
