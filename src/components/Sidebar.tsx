
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Bell, CalendarDays, ClipboardCheck, Clock, FileText, Home, Users, CreditCard, Settings } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import NotificationCenter from "@/components/notifications/NotificationCenter";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navItems = [{
  icon: Home,
  label: "Dashboard",
  path: "/"
}, {
  icon: Users,
  label: "Employees",
  path: "/employees"
}, {
  icon: FileText,
  label: "Contracts",
  path: "/contracts"
}, {
  icon: Clock,
  label: "Attendance",
  path: "/attendance"
}, {
  icon: CreditCard,
  label: "Payroll",
  path: "/payroll"
}, {
  icon: CalendarDays,
  label: "Leaves",
  path: "/leaves"
}, {
  icon: ClipboardCheck,
  label: "Checklists",
  path: "/checklists"
}, {
  icon: Settings,
  label: "Administration",
  path: "/administration"
}];

const Sidebar = ({
  open,
  setOpen
}: SidebarProps) => {
  const location = useLocation();
  const { notifications, markAsRead, clearAllNotifications, unreadCount } = useNotifications();
  
  return <>
      {/* Backdrop for mobile */}
      {open && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)}></div>}

      {/* Sidebar */}
      <div className={cn("fixed top-0 left-0 z-50 h-full w-16 bg-white dark:bg-black border-r shadow-sm transition-transform duration-300 md:translate-x-0 md:z-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex flex-col h-full">
          <div className="p-3 border-b flex justify-center">
            <img src="/lovable-uploads/3b0f2146-354a-4718-b5d4-d20dc1907ba1.png" alt="BBQ House Logo" className="h-8 w-8 object-contain" />
          </div>

          {/* Notification Center */}
          <div className="p-2 border-b flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center">
              <NotificationCenter 
                notifications={notifications}
                onSelect={(notification) => {
                  markAsRead(notification.id);
                  // Navigation will be handled by DashboardLayout
                }}
                onMarkAsRead={markAsRead}
                onClearAll={clearAllNotifications}
              />
            </div>
          </div>

          <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  title={item.label}
                  className={cn(
                    "h-10 w-10 flex items-center justify-center rounded-md mx-auto transition-colors", 
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t flex justify-center">
            <div className="text-[10px] text-muted-foreground">
              BBQ
            </div>
          </div>
        </div>
      </div>
    </>;
};

export default Sidebar;
