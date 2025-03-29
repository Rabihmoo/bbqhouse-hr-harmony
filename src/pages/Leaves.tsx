
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface LeavesProps {
  onLogout?: () => void;
}

const Leaves = ({ onLogout }: LeavesProps) => {
  return (
    <DashboardLayout 
      title="Leaves" 
      subtitle="Manage employee leave requests"
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden p-6">
          <h2 className="text-xl font-semibold mb-4">Leave Management</h2>
          <p className="text-muted-foreground">
            This feature is coming soon. Check back later for leave management capabilities.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leaves;
