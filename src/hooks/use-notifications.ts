
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

// Maximum number of notifications to store in localStorage
const MAX_NOTIFICATIONS = 50;

export const useNotifications = (initialNotifications: Notification[] = []) => {
  const STORAGE_KEY = 'bbq-notifications';
  
  // Load notifications from localStorage or use initial
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const savedNotifications = localStorage.getItem(STORAGE_KEY);
      return savedNotifications ? JSON.parse(savedNotifications) : initialNotifications;
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
      return initialNotifications;
    }
  });

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      // Limit the number of notifications to prevent quota errors
      const limitedNotifications = notifications.slice(0, MAX_NOTIFICATIONS);
      
      // Only store essential data to reduce storage size
      const storageData = limitedNotifications.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        time: notification.time,
        read: notification.read,
        // Don't store the icon in localStorage as it might be a React component
        // Store any additional data that's not a React component
        data: notification.data ? JSON.parse(JSON.stringify(notification.data)) : undefined
      }));
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
      
      // If we encounter a quota error, try removing older notifications
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        const reducedNotifications = notifications.slice(0, Math.floor(MAX_NOTIFICATIONS / 2));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedNotifications));
        } catch (innerError) {
          // If still failing, clear notifications storage
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, [notifications]);

  // Add a new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date().toLocaleString(),
      read: false
    };
    
    setNotifications(prev => {
      // Add at the beginning and maintain max limit
      const updated = [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS);
      return updated;
    });
    
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
