
import React from 'react';
import { Bell, X, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { 
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { Notification, NotificationType } from "@/types/notification";
import { format } from "date-fns";

interface NotificationCenterProps {
  notifications: Notification[];
  onClick?: (notification: Notification) => void;
  onClose?: () => void;
  onSelect?: (notification: Notification) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onClick,
  onClose,
  onSelect
}) => {
  const [open, setOpen] = React.useState(false);
  
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800';
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    if (onSelect) {
      onSelect(notification);
    } else if (onClick) {
      onClick(notification);
    }
    
    if (onClose) {
      onClose();
    } else {
      setOpen(false);
    }
  };
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setOpen(false);
    }
  };
  
  return (
    <div className="absolute top-full right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-md shadow-lg border z-50">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Notifications</h3>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {notifications.length}
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No notifications
        </div>
      ) : (
        <div className="divide-y">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={cn(
                "p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                notification.employeeId && "cursor-pointer"
              )}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(notification.timestamp), 'HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  {notification.employeeId && (
                    <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                      Click to view employee
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
