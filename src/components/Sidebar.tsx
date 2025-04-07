import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Bell, CalendarDays, ClipboardCheck, Clock, FileText, Home, Users, CreditCard, Settings, ChevronRight, ChevronLeft } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { useState, useEffect } from "react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onNotificationClick?: (notification: any) => void;
}

const navItems = [
  {
    icon: Home,
    label: "Dashboard",
    path: "/"
  },
  {
    icon: Users,
    label: "Employees",
    path: "/employees"
  },
  {
    icon: FileText,
    label: "Contracts",
    path: "/contracts"
  },
  {
    icon: Clock,
    label: "Attendance",
    path: "/attendance"
  },
  {
    icon: CreditCard,
    label: "Payroll",
    path: "/payroll"
  },
  {
    icon: CalendarDays,
    label: "Leaves",
    path: "/leaves"
  },
  {
    icon: ClipboardCheck,
    label: "Checklists",
    path: "/checklists"
  },
  {
    icon: Settings,
    label: "Administration",
    path: "/administration"
  }
];

const Sidebar = ({
  open,
  setOpen,
  onNotificationClick
}: SidebarProps) => {
  const location = useLocation();
  const { notifications, markAsRead, clearAllNotifications, unreadCount } = useNotifications();
  const [expanded, setExpanded] = useState(false);
  
  const toggleSidebar = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    localStorage.setItem('sidebar-expanded', newExpandedState.toString());
  };

  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-expanded');
    if (savedState !== null) {
      setExpanded(savedState === 'true');
    }
  }, []);

  return <>
      {open && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)}></div>}

      <div className={cn(
        "fixed top-0 left-0 z-50 h-full bg-white dark:bg-black border-r shadow-sm transition-all duration-300 md:translate-x-0 md:z-0",
        expanded ? "w-48" : "w-16",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-3 border-b flex justify-center items-center">
            <img src="/lovable-uploads/3b0f2146-354a-4718-b5d4-d20dc1907ba1.png" alt="MYR System Logo" className="h-8 w-8 object-contain" title="MYR System Management" />
            {expanded && <span className="ml-2 text-sm font-medium">MYR HR Management</span>}
          </div>

          <button 
            onClick={toggleSidebar}
            className="absolute -right-3 top-12 bg-primary text-white rounded-full p-1 shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>

          <div className="p-2 border-b flex justify-center">
            <div className={cn("flex items-center justify-center", expanded ? "w-full" : "w-10 h-10")}>
              <NotificationCenter 
                notifications={notifications}
                onSelect={(notification) => {
                  markAsRead(notification.id);
                  if (onNotificationClick) {
                    onNotificationClick(notification);
                  }
                }}
                onMarkAsRead={markAsRead}
                onClearAll={clearAllNotifications}
              />
              {expanded && <span className="ml-2 text-sm">Notifications</span>}
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
                    "h-10 flex items-center justify-start rounded-md mx-auto transition-colors px-2", 
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 min-w-[20px]" />
                  {expanded && <span className="ml-2 text-sm whitespace-nowrap">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t flex justify-center">
            <div className="text-[10px] text-muted-foreground">
              {expanded ? "MYR HR Management" : "MYR"}
            </div>
          </div>
        </div>
      </div>
    </>;
};

export default Sidebar;
