import { ref } from 'vue';

export const isAuthenticated = ref(false);
export const user = ref<{ avatar: string; username: string } | null>(null);

export function login() {
  // Simulate login process
  isAuthenticated.value = true;
  user.value = {
    avatar: 'https://cdn.discordapp.com/avatars/user_id/avatar_hash.png',
    username: 'User123',
  };
}

export function logout() {
  isAuthenticated.value = false;
  user.value = null;
}