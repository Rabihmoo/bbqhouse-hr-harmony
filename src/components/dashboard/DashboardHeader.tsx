
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notification } from "@/types/notification";
import UserProfileMenu from "../users/UserProfileMenu";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
}

const DashboardHeader = ({ 
  title, 
  subtitle,
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col w-full animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 px-6 border-b w-full">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search..." className="pl-10 w-full" />
          </div>
        </div>
      </div>
      
      {/* New line under title and subtitle */}
      <div className="w-full bg-primary/10 px-6 py-2 text-sm text-primary-foreground/70">
        MYR System Management - Employee Dashboard
      </div>
    </div>
  );
};

export default DashboardHeader;
