import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CalendarDays, ClipboardCheck, Clock, FileText, Home, Users, CreditCard, Settings } from "lucide-react";
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
  return <>
      {/* Backdrop for mobile */}
      {open && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)}></div>}

      {/* Sidebar */}
      <div className={cn("fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-black border-r shadow-sm transition-transform duration-300 md:translate-x-0 md:z-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/3b0f2146-354a-4718-b5d4-d20dc1907ba1.png" alt="BBQ House Logo" className="h-8 w-8 object-contain" />
              <h1 className="text-xl font-semibold">BBQHouse HRM</h1>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(item => <Link key={item.path} to={item.path} className="">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>)}
          </nav>

          <div className="p-6 border-t">
            <div className="text-xs text-muted-foreground">
              BBQHouse HR Management System
            </div>
          </div>
        </div>
      </div>
    </>;
};
export default Sidebar;