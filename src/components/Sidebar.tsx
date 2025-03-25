
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Clipboard,
  Clock,
  CreditCard,
  Calendar,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const isCurrentPage = (path: string) => {
    return location.pathname === path;
  };

  const MenuItem = ({ path, name, icon }: { path: string; name: string; icon: React.ReactNode }) => {
    const isActive = isCurrentPage(path);

    return (
      <li>
        <Link
          to={path}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-accent text-accent-foreground"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          {icon}
          <span>{name}</span>
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={toggle}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="border-b py-6 px-4 mb-4 flex items-center space-x-2">
            <img src="/logo.png" alt="Company Logo" className="h-8 w-auto" />
            <h2 className="text-xl font-bold">BBQHouse HRM</h2>
          </div>

          <nav className="flex-1 px-2">
            <ul className="space-y-1">
              <MenuItem path="/" name="Dashboard" icon={<Home size={18} />} />
              <MenuItem path="/employees" name="Employees" icon={<Users size={18} />} />
              <MenuItem path="/contracts" name="Contracts" icon={<Clipboard size={18} />} />
              <MenuItem path="/attendance" name="Attendance" icon={<Clock size={18} />} />
              <MenuItem path="/payroll" name="Payroll" icon={<CreditCard size={18} />} />
              <MenuItem path="/leaves" name="Leaves" icon={<Calendar size={18} />} />
              <MenuItem path="/administration" name="Administration" icon={<Settings size={18} />} />
            </ul>
          </nav>

          <div className="mt-auto border-t p-4">
            <div className="text-sm text-muted-foreground">
              <p>BBQHouse Management</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close mobile menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggle}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
