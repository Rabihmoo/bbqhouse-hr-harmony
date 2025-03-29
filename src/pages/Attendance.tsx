
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface AttendanceProps {
  onLogout?: () => void;
}

const Attendance = ({ onLogout }: AttendanceProps) => {
  return (
    <DashboardLayout 
      title="Attendance" 
      subtitle="Track and manage employee attendance"
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden p-6">
          <h2 className="text-xl font-semibold mb-4">Employee Attendance</h2>
          <p className="text-muted-foreground">
            This feature is coming soon. Check back later for attendance tracking capabilities.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
