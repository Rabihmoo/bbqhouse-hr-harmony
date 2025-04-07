
import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useMobileCheck } from "@/hooks/use-mobile";
import { useNotifications } from "@/hooks/use-notifications";
import { Notification as TypedNotification } from "@/hooks/use-notifications";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { useEmployeeNotifications } from "@/hooks/employee-notifications";
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
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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

  // Check sidebar expanded state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-expanded');
    if (savedState !== null) {
      setSidebarExpanded(savedState === 'true');
    }
  }, []);

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
            type: notification.type
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
      navigate(`/leaves?tab=missing`);
      toast.success("Navigated to missing leaves");
    }
    else if (notification.title.includes('Annual Leave')) {
      // Navigate to the leaves page for annual leave management
      navigate(`/leaves?tab=allowances`);
      toast.success("Navigated to leave allowances");
    }
    else if (notification.title.includes('Unused Annual Leave')) {
      // Navigate to the leaves page for missing leaves
      navigate(`/leaves?tab=missing`);
      toast.success("Navigated to missing leaves");
    }
    else if (notification.title.includes('Expired') || notification.title.includes('Missing')) {
      // Navigate to the employee that has missing or expired documents
      if (notification.data?.employeeId) {
        navigate(`/employees?id=${notification.data.employeeId}`);
        toast.success("Navigated to employee with document issues");
      }
    }
    else if (notification.title.includes('Checklist')) {
      // Navigate to the checklists page
      navigate('/checklists');
      toast.success("Navigated to checklists");
    }
    else {
      // Default to employee list if there's an employeeId
      if (notification.data?.employeeId) {
        navigate(`/employees?id=${notification.data.employeeId}`);
      } else if (notification.data?.page) {
        // Navigate to specific page if provided
        navigate(notification.data.page);
        toast.success(`Navigated to ${notification.data.page.substring(1)}`);
      } else {
        navigate('/employees');
      }
    }
  };

  // Handle sidebar expansion update
  const handleSidebarExpansionChange = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen} 
        onNotificationClick={handleNotificationClick}
        onExpandedChange={handleSidebarExpansionChange}
      />
      
      <div className={`flex-1 flex flex-col h-screen overflow-auto bg-background/80 transition-all duration-300 ${sidebarExpanded ? "ml-48" : "ml-16"}`}>
        <DashboardHeader title={title} subtitle={subtitle} />
        
        <main className="flex-1 container py-6 px-4 md:px-6 w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
