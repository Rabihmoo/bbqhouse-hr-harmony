
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  BarChart, 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  Menu, 
  X, 
  LogOut,
  DollarSign
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarWidth = collapsed ? "w-20" : "w-64";
  const logoSize = collapsed ? "w-12 h-12" : "w-24 h-24";
  const textVisibility = collapsed ? "opacity-0" : "opacity-100";

  const menu = [
    { name: "Dashboard", path: "/", icon: <BarChart size={24} /> },
    { name: "Employees", path: "/employees", icon: <Users size={24} /> },
    { name: "Leave Management", path: "/leaves", icon: <Calendar size={24} /> },
    { name: "Attendance", path: "/attendance", icon: <Clock size={24} /> },
    { name: "Contracts", path: "/contracts", icon: <FileText size={24} /> },
    { name: "Payroll", path: "/payroll", icon: <DollarSign size={24} /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/3b0f2146-354a-4718-b5d4-d20dc1907ba1.png" 
            alt="BBQ House Logo" 
            className={cn("transition-all duration-300", logoSize)} 
          />
          <div className={cn("flex flex-col transition-all duration-300", textVisibility, collapsed ? "invisible w-0" : "visible")}>
            <h2 className="text-xl font-bold text-white">BBQ HOUSE</h2>
            <p className="text-xs text-white/70">HR Management</p>
          </div>
        </div>
        {!isMobile && (
          <button 
            onClick={toggleSidebar} 
            className="text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        )}
      </div>

      <div className="mt-2 px-3">
        <div className="space-y-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive(item.path)
                  ? "bg-bbqred text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <span className="text-current">{item.icon}</span>
              <span className={cn("transition-all duration-300", textVisibility, collapsed ? "invisible w-0" : "visible")}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto mb-5 px-4">
        <div className={cn("border-t border-white/10 pt-4 mt-4", textVisibility, collapsed ? "invisible" : "visible")}>
          <div className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200 cursor-pointer">
            <LogOut size={24} />
            <span className={cn("transition-all duration-300", textVisibility, collapsed ? "invisible w-0" : "visible")}>
              Log Out
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 p-2 z-50 bg-bbqblack text-white rounded-lg"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <div
        className={cn(
          "h-screen bg-bbqblack text-white flex flex-col transition-all duration-300 z-40",
          isMobile
            ? mobileOpen
              ? "fixed inset-y-0 left-0 w-64"
              : "fixed inset-y-0 -left-64"
            : sidebarWidth,
          "flex-shrink-0"
        )}
      >
        {sidebarContent}
      </div>

      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
