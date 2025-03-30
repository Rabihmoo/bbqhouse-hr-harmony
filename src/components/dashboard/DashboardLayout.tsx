import { ReactNode, useState, useEffect } from "react";
import { User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMobileCheck } from "@/hooks/use-mobile";
import DashboardHeader from "./DashboardHeader";
import { useNotifications } from "@/hooks/use-notifications";
import { Notification as TypedNotification } from "@/hooks/use-notifications";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { useEmployeeNotifications } from "@/hooks/use-employee-notifications";
interface Notification extends TypedNotification {}
interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  notifications?: Notification[];
  onNotificationClick?: (notification: any) => void;
  onLogout?: () => void;
}
const DashboardLayout = ({
  children,
  title,
  subtitle,
  notifications: externalNotifications,
  onNotificationClick,
  onLogout
}: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMobileCheck();

  // Get employees data to generate notifications
  const {
    employees
  } = useEmployeeData();
  // Get employee-based notifications
  const {
    notifications: employeeNotifications
  } = useEmployeeNotifications(employees);
  const {
    notifications: internalNotifications,
    markAsRead,
    addNotification,
    clearAllNotifications,
    unreadCount
  } = useNotifications();

  // Combine notifications with employee notifications
  useEffect(() => {
    // Add employee notifications to the notification system if they don't already exist
    if (employeeNotifications && employeeNotifications.length > 0) {
      employeeNotifications.forEach(notification => {
        // Check if notification already exists to avoid duplicates
        const exists = internalNotifications.some(n => n.id === notification.id);
        if (!exists) {
          addNotification({
            title: notification.title,
            message: notification.message,
            icon: notification.icon,
            data: notification.data
          });
        }
      });
    }
  }, [employeeNotifications, addNotification, internalNotifications]);

  // Use external notifications if provided, otherwise use internal
  const notifications = externalNotifications || internalNotifications;
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("hr-auth");
      navigate("/");
      window.location.reload();
    }
  };
  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (onNotificationClick) {
      onNotificationClick(notification);
    } else if (notification.data?.employeeId) {
      // Navigate to employee details if employeeId is present
      navigate(`/employees?id=${notification.data.employeeId}`);
    }
  };
  return <div className="flex h-screen overflow-hidden w-full">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col h-screen overflow-auto bg-background/80 w-full">
        
        
        <main className="flex-1 container py-6 w-full">
          {children}
        </main>
      </div>
    </div>;
};
export default DashboardLayout;