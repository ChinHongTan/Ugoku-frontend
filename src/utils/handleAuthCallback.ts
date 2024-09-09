import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';

type User = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  verified: boolean;
  email: string;
  flags: number;
  banner: string;
  accent_color: number;
  premium_type: number;
  public_flags: number;
  avatar_decoration_data: {
    sku_id: string;
    asset: string;
  };
};

export async function handleAuthCallback() {
  const userStore = useUserStore();
  const router = useRouter();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (token) {
    try {
      const response: AxiosResponse<{ user: User }> = await axios.get<{ user: User }>('http://localhost:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.setItem('token', token);
      userStore.setUser(response.data.user);

      // Redirect to home page or dashboard
      router.push('/');
    } catch (error) {
      console.error('Error fetching user info:', error);
      // Handle error by redirecting to an error page
      router.push('/login-error');
    }
  } else {
    console.error('No token found in URL');
    router.push('/login-error');
  }
}