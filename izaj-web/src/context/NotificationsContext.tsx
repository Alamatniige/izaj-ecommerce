"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useUserContext } from './UserContext';

export interface Notification {
  id: string;
  user_id: string;
  type: 'order' | 'promo' | 'review' | 'system' | 'favorite' | 'payment';
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  order_id: string | null;
  order_number: string | null;
  created_at: string;
  updated_at: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      } else {
        console.error('Failed to fetch notifications');
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up real-time subscription for notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time notification update:', payload);
          
          if (payload.eventType === 'INSERT') {
            // New notification added
            setNotifications((prev) => [payload.new as Notification, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            // Notification updated (e.g., marked as read)
            setNotifications((prev) =>
              prev.map((notification) =>
                notification.id === payload.new.id ? (payload.new as Notification) : notification
              )
            );
          } else if (payload.eventType === 'DELETE') {
            // Notification deleted
            setNotifications((prev) =>
              prev.filter((notification) => notification.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
      });

      if (response.ok) {
        // Optimistically update UI
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id ? { ...notification, is_read: true } : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
      });

      if (response.ok) {
        // Optimistically update UI
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, is_read: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Optimistically update UI
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

