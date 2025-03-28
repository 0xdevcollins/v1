"use client"
import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/useSearch';
import { NotificationList } from './NotificationList';
import { UserNav } from './UserNav';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  searchFunction: (query: string) => Promise<any[]>;
  placeholder?: string;
  avatarSrc?: string;
  avatarFallback?: string;
  className?: string;
}

export default function SearchBar({
  searchFunction,
  placeholder = "Search anything....",
  avatarSrc,
  avatarFallback = "U",
  className = "",
}: SearchBarProps) {
  const { query, isSearching, handleSearch } = useSearch({ searchFunction });
  const {
    notifications,
    fetchNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification
  } = useNotificationStore();

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      // console.error('Logout failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-4 lg:gap-6 ${className}`}>
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-full bg-muted/50 pl-10 text-lg"
          aria-label="Search"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
            <span className="animate-spin">⌛</span>
          </div>
        )}
      </div>
      <div className="hidden items-center gap-4 md:flex">
        <NotificationList
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onRemove={deleteNotification}
        />
        <UserNav avatarSrc={avatarSrc} avatarFallback={avatarFallback} onLogout={handleLogout} />
      </div>
    </form>
  );
}

