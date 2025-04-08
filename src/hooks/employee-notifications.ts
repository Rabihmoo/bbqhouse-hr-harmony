
import { useState, useEffect } from 'react';
import { useAnniversaryNotifications } from './employee-notifications/use-anniversary-notifications';
import { useDocumentNotifications } from './employee-notifications/use-document-notifications';
import { useLeaveNotifications } from './employee-notifications/use-leave-notifications';
import { useMissingInfoNotifications } from './employee-notifications/use-missing-info-notifications';
import { Notification } from './use-notifications';

export const useEmployeeNotifications = (employees: any[]) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const anniversaryNotifications = useAnniversaryNotifications(employees);
  const documentNotifications = useDocumentNotifications(employees);
  const leaveNotifications = useLeaveNotifications(employees);
  const missingInfoNotifications = useMissingInfoNotifications(employees);
  
  useEffect(() => {
    const exportNotifications = getExportNotifications();
    
    // Combine all notifications
    const allNotifications = [
      ...anniversaryNotifications,
      ...documentNotifications,
      ...leaveNotifications,
      ...missingInfoNotifications,
      ...exportNotifications
    ];
    
    // Sort by date (newest first)
    allNotifications.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setNotifications(allNotifications);
  }, [
    anniversaryNotifications, 
    documentNotifications, 
    leaveNotifications, 
    missingInfoNotifications
  ]);
  
  return { notifications };
};

// Get notifications for declarations exports
const getExportNotifications = (): Notification[] => {
  const exportNotifications: Notification[] = [];
  
  try {
    // Get export records from localStorage
    const exportRecordsStr = localStorage.getItem('bbq-employee-exports') || '[]';
    const exportRecords = JSON.parse(exportRecordsStr);
    
    // Get latest 10 exports
    const recentExports = exportRecords
      .sort((a: any, b: any) => new Date(b.exportDate).getTime() - new Date(a.exportDate).getTime())
      .slice(0, 10);
    
    // Create notifications for each export
    recentExports.forEach((record: any) => {
      exportNotifications.push({
        id: `export-${record.id}`,
        title: `Declaration Exported`,
        message: `Declaration for ${record.employeeName} - ${record.month} ${record.year} has been exported`,
        date: record.exportDate,
        read: false,
        type: 'info',
        employeeId: record.employeeId
      });
    });
  } catch (error) {
    console.error("Error creating export notifications:", error);
  }
  
  return exportNotifications;
};

export default useEmployeeNotifications;
