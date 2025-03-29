
import { useState, useCallback, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon?: React.ReactNode;
  data?: any;
}

export const useNotifications = (initialNotifications: Notification[] = []) => {
  const STORAGE_KEY = 'bbq-notifications';
  
  // Load notifications from localStorage or use initial
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem(STORAGE_KEY);
    return savedNotifications ? JSON.parse(savedNotifications) : initialNotifications;
  });

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Add a new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date().toLocaleString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification.id;
  }, []);

  // Mark a notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true } 
          : notif
      )
    );
  }, []);

  // Remove a notification
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    addNotification,
    markAsRead,
    removeNotification,
    clearAllNotifications,
    unreadCount
  };
};
