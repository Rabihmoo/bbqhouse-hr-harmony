
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface PayrollProps {
  onLogout?: () => void;
}

const Payroll = ({ onLogout }: PayrollProps) => {
  return (
    <DashboardLayout 
      title="Payroll" 
      subtitle="Manage employee payroll"
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden p-6">
          <h2 className="text-xl font-semibold mb-4">Payroll Management</h2>
          <p className="text-muted-foreground">
            This feature is coming soon. Check back later for payroll management capabilities.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payroll;
