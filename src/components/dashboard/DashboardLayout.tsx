
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      
      <div className={cn("flex-1 flex flex-col overflow-hidden")}>
        <DashboardHeader title={title} subtitle={subtitle} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="page-transition">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
