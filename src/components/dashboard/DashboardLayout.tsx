
import React from "react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Notification } from "@/types/notification";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
}

const DashboardLayout = ({ 
  children, 
  title, 
  subtitle,
  notifications = [],
  onNotificationClick
}: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 antialiased">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title={title} 
          subtitle={subtitle} 
          notifications={notifications}
          onNotificationClick={onNotificationClick}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
