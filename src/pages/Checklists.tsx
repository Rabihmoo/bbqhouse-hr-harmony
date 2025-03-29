import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface ChecklistsProps {
  onLogout?: () => void;
}

const Checklists = ({ onLogout }: ChecklistsProps) => {
  return (
    <DashboardLayout 
      title="Checklists" 
      subtitle="Download and manage checklists"
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden p-6">
          <h2 className="text-xl font-semibold mb-4">Checklists</h2>
          <p className="text-muted-foreground">
            This feature is coming soon. Checklists will be available for download shortly.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Checklists;
