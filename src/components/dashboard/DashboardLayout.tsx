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
  
  const { 
    notifications: internalNotifications, 
    markAsRead,
    unreadCount
  } = useNotifications();

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
    }
  };

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col h-screen overflow-auto bg-background/80 w-full">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b shadow-sm w-full">
          <div className="container py-3 flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12"/>
                  <line x1="4" x2="20" y1="6" y2="6"/>
                  <line x1="4" x2="20" y1="18" y2="18"/>
                </svg>
              </Button>
              
              <div className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/3b0f2146-354a-4718-b5d4-d20dc1907ba1.png" 
                  alt="BBQ House Logo" 
                  className="h-8 w-8 object-contain"
                />
                <h1 className="text-xl font-semibold hidden md:block">BBQHOUSE HR</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <NotificationCenter 
                notifications={notifications} 
                onSelect={handleNotificationClick}
                onMarkAsRead={markAsRead}
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@bbqhouse.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="container w-full">
            <DashboardHeader title={title} subtitle={subtitle} />
            
            {!isMobile && (
              <div className="mb-6">
                <Tabs defaultValue="dashboard">
                  <TabsList>
                    <TabsTrigger value="dashboard" onClick={() => navigate("/")}>
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="employees" onClick={() => navigate("/employees")}>
                      Employees
                    </TabsTrigger>
                    <TabsTrigger value="leaves" onClick={() => navigate("/leaves")}>
                      Leaves
                    </TabsTrigger>
                    <TabsTrigger value="attendance" onClick={() => navigate("/attendance")}>
                      Attendance
                    </TabsTrigger>
                    <TabsTrigger value="payroll" onClick={() => navigate("/payroll")}>
                      Payroll
                    </TabsTrigger>
                    <TabsTrigger value="contracts" onClick={() => navigate("/contracts")}>
                      Contracts
                    </TabsTrigger>
                    <TabsTrigger value="checklists" onClick={() => navigate("/checklists")}>
                      Checklists
                    </TabsTrigger>
                    <TabsTrigger value="administration" onClick={() => navigate("/administration")}>
                      Administration
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
          </div>
        </header>
        
        <main className="flex-1 container py-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
