
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 px-6 border-b animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
        <div className="relative flex-1 md:flex-initial md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search..." className="pl-10 w-full" />
        </div>
        
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-bbqred text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">3</span>
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-bbqblack flex items-center justify-center text-white font-medium">
            RM
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
