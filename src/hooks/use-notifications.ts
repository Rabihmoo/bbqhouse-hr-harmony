
import { useState, useCallback, useEffect, useRef } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon?: React.ReactNode;
  data?: any;
}

// Further reduce maximum notifications to prevent quota errors
const MAX_NOTIFICATIONS = 25;

export const useNotifications = (initialNotifications: Notification[] = []) => {
  const STORAGE_KEY = 'bbq-notifications';
  const effectRan = useRef(false);
  
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

  // Save notifications to localStorage whenever they change - with useRef guard to prevent infinite loops
  useEffect(() => {
    // Skip the first render to prevent potential infinite loops
    if (effectRan.current === false) {
      effectRan.current = true;
      return;
    }
    
    try {
      // More aggressive limitation of stored notifications
      const limitedNotifications = notifications.slice(0, MAX_NOTIFICATIONS);
      
      // Optimize stored data size by removing unnecessary fields and truncating long messages
      const storageData = limitedNotifications.map(notification => ({
        id: notification.id,
        title: notification.title.substring(0, 50), // Limit title length
        message: notification.message.substring(0, 100), // Limit message length
        time: notification.time,
        read: notification.read,
        // Don't store icon as it might be a React component
        // Store minimal data object if present
        data: notification.data ? 
          // Only store employeeId if available, drop other data
          (notification.data.employeeId ? { employeeId: notification.data.employeeId } : undefined)
          : undefined
      }));
      
      // Try to compress data by stringifying once
      const storageString = JSON.stringify(storageData);
      
      // Check if the string is too large before trying to store it (5MB is typical limit)
      if (storageString.length > 4 * 1024 * 1024) {
        // Too large, store a reduced set
        const reducedData = storageData.slice(0, 10); // Only keep 10 most recent
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedData));
        console.warn('Notifications data was too large, reduced to 10 items');
      } else {
        localStorage.setItem(STORAGE_KEY, storageString);
      }
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
      
      // Handle quota exceeded error
      if (error instanceof DOMException && 
         (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.warn('Storage quota exceeded, attempting to save reduced data');
        
        try {
          // Clear existing storage for this key
          localStorage.removeItem(STORAGE_KEY);
          
          // Try with just 5 most recent, unread notifications
          const criticalNotifications = notifications
            .filter(n => !n.read)
            .slice(0, 5)
            .map(n => ({
              id: n.id,
              title: n.title.substring(0, 30),
              message: n.message.substring(0, 50),
              time: n.time,
              read: n.read
              // No data or other fields
            }));
            
          localStorage.setItem(STORAGE_KEY, JSON.stringify(criticalNotifications));
        } catch (innerError) {
          // If still failing, give up on storage
          console.error('Failed to save even reduced notifications set:', innerError);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, [notifications]);

  // Add a new notification with deduplication
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      time: new Date().toLocaleString(),
      read: false
    };
    
    setNotifications(prev => {
      // Check if similar notification already exists (by title)
      const exists = prev.some(n => 
        n.title === notification.title && 
        !n.read &&
        // Only consider notifications from the last hour as duplicates
        (new Date().getTime() - new Date(n.time).getTime() < 3600000)
      );
      
      if (exists) {
        return prev; // Don't add duplicate recent notifications
      }
      
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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing notifications from localStorage:', error);
    }
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
