import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, loading, login, logout, register, fetchCurrentUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Create an async function inside the useEffect to handle the async operation
    const fetchUserData = async () => {
      try {
        await fetchCurrentUser();
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    // Call the async function
    fetchUserData();
  }, [fetchCurrentUser]);

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    router.push('/dashboard'); // Redirect to the dashboard after login
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login'); // Redirect to login page after logout
  };

  const handleRegister = async (
    email: string,
    password: string,
    password_confirmation: string,
    first_name: string,
    last_name: string
  ) => {  
    await register(email, password, password_confirmation, first_name, last_name);
    router.push('/dashboard'); // Redirect to the dashboard after registration
  };

  return { user, loading, login: handleLogin, logout: handleLogout, register: handleRegister };
}