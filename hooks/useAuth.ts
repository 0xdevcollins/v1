import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, loading, login, logout, register, fetchCurrentUser, verifyEmail, resendOtp, forgotPassword, resetPassword } =
    useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Create an async function inside the useEffect to handle the async operation
    const fetchUserData = async () => {
      try {
        // console.log(3333)
        await fetchCurrentUser();
      } catch (error) {
        // console.error('Error fetching current user:', error);
      }
    };

    // Call the async function
    fetchUserData();
  }, [fetchCurrentUser]);

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    router.push('/dashboard'); // Redirect to the dashboard after login
  };

  const verify = async (email: string, token: string) => {
    await verifyEmail(email, token);
    router.push('/auth/login');
  };

  const resend = async (email: string) => {
    await resendOtp(email);
    router.push('/auth/otp');
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
    last_name: string,
    plan?: string,
    isTrial?: boolean
  ) => {
    await register(email, password, password_confirmation, first_name, last_name, plan, isTrial);
    router.push('/dashboard'); // Redirect to the dashboard after registration
  };

  const handleForgotPassword = async (email: string) => {
    await forgotPassword(email);
    router.push('/auth/otp');
  };

  const handleResetPassword = async (token: string, password: string) => {
    await resetPassword(token, password);
    router.push('/auth/login');
  };

  return {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    verify,
    resend,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
  };
}
