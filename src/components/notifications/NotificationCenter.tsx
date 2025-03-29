
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon?: React.ReactNode;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onSelect?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onClearAll?: () => void;
}

const NotificationCenter = ({ 
  notifications = [], 
  onSelect,
  onMarkAsRead,
  onClearAll
}: NotificationCenterProps) => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // Count unread notifications
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);
  
  const handleNotificationClick = (notification: Notification) => {
    if (onSelect) {
      onSelect(notification);
    }
    
    // Mark as read only if the user has actually opened it
    if (onMarkAsRead && !notification.read) {
      onMarkAsRead(notification.id);
    }
    
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="px-4 py-3 border-b border-border flex justify-between items-center">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {notifications.length > 0 && onClearAll && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear all
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 text-center">
              No notifications
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.slice(0, 50).map((notification) => (
                <li 
                  key={notification.id} 
                  className={cn(
                    "px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors",
                    notification.read ? "opacity-60" : ""
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {notification.icon || <Bell className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-1 text-left">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
