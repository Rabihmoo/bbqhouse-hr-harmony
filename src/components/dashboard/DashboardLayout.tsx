
import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useMobileCheck } from "@/hooks/use-mobile";
import { useNotifications } from "@/hooks/use-notifications";
import { Notification as TypedNotification } from "@/hooks/use-notifications";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { useEmployeeNotifications } from "@/hooks/use-employee-notifications";
import DashboardHeader from "./DashboardHeader";
import { toast } from "sonner";

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
  const { employees } = useEmployeeData();
  
  // Get employee-based notifications
  const { notifications: employeeNotifications } = useEmployeeNotifications(employees);
  
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
            data: notification.data,
            type: notification.type // Use type instead of actionType
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
      return;
    }
    
    // Handle different notification action types
    if (notification.type === 'view-employee' && notification.data?.employeeId) {
      // Navigate to employee details
      navigate(`/employees?id=${notification.data.employeeId}`);
      toast.success("Navigated to employee record");
    } 
    else if (notification.type === 'approve-leave' && notification.data?.employeeId) {
      // Navigate to leave approvals
      navigate(`/leaves?tab=requests&employeeId=${notification.data.employeeId}`);
      toast.success("Navigated to leave requests");
    }
    else if (notification.type === 'warning' && notification.title.includes('Leave')) {
      // Navigate to leaves with the missing leaves tab active
      navigate(`/leaves?tab=allowances`);
      toast.success("Navigated to leave allowances");
    }
    else if (notification.title.includes('Expired') || notification.title.includes('Missing')) {
      // Navigate to the employee that has missing or expired documents
      if (notification.data?.employeeId) {
        navigate(`/employees?id=${notification.data.employeeId}`);
        toast.success("Navigated to employee with document issues");
      }
    }
    else {
      // Default to employee list if there's an employeeId
      if (notification.data?.employeeId) {
        navigate(`/employees?id=${notification.data.employeeId}`);
      } else {
        navigate('/employees');
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col h-screen overflow-auto bg-background/80 ml-16">
        <DashboardHeader title={title} subtitle={subtitle} />
        
        <main className="flex-1 container max-w-5xl py-6 px-4 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
