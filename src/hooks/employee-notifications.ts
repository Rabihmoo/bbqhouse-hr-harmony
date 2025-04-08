
import { useState, useEffect } from 'react';
import { useAnniversaryNotifications } from './employee-notifications/use-anniversary-notifications';
import { useDocumentNotifications } from './employee-notifications/use-document-notifications';
import { useLeaveNotifications } from './employee-notifications/use-leave-notifications';
import { useMissingInfoNotifications } from './employee-notifications/use-missing-info-notifications';
import { Notification } from '@/types/notification';

export const useEmployeeNotifications = (employees: any[]) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const { generateAnniversaryNotifications } = useAnniversaryNotifications();
  const { generateDocumentNotifications } = useDocumentNotifications();
  const { generateLeaveNotifications } = useLeaveNotifications();
  const { generateMissingInfoNotifications } = useMissingInfoNotifications();
  
  useEffect(() => {
    const exportNotifications = getExportNotifications();
    
    // Combine all notifications
    const allNotifications = [
      ...generateAnniversaryNotifications(employees),
      ...generateDocumentNotifications(employees),
      ...generateLeaveNotifications(employees),
      ...generateMissingInfoNotifications(employees),
      ...exportNotifications
    ];
    
    // Sort by timestamp (newest first)
    allNotifications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    setNotifications(allNotifications);
  }, [
    employees,
    generateAnniversaryNotifications,
    generateDocumentNotifications,
    generateLeaveNotifications,
    generateMissingInfoNotifications
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
        type: 'info',
        title: `Declaration Exported`,
        message: `Declaration for ${record.employeeName} - ${record.month} ${record.year} has been exported`,
        employeeId: record.employeeId,
        timestamp: record.exportDate,
        time: new Date(record.exportDate).toLocaleString(),
        read: false,
        data: { employeeId: record.employeeId }
      });
    });
  } catch (error) {
    console.error("Error creating export notifications:", error);
  }
  
  return exportNotifications;
};

export default useEmployeeNotifications;
