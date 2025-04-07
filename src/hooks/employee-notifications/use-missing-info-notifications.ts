
import { Notification } from "@/types/notification";

export const useMissingInfoNotifications = () => {
  const generateMissingInfoNotifications = (employees: any[]): Notification[] => {
    const notifications: Notification[] = [];
    
    employees.forEach(employee => {
      const employeeId = employee.id;
      const employeeName = employee.fullName;
      
      // Check for missing required information
      const missingFields = [];
      if (!employee.biNumber) missingFields.push('BI Number');
      if (!employee.inssNumber) missingFields.push('INSS Number');
      if (!employee.phone) missingFields.push('Phone');
      if (!employee.address) missingFields.push('Address');
      if (!employee.position) missingFields.push('Position');
      if (!employee.department) missingFields.push('Department');
      if (!employee.salary) missingFields.push('Salary');
      if (!employee.picture) missingFields.push('Profile Picture');
      
      if (missingFields.length > 0) {
        notifications.push({
          id: `missing-${employeeId}`,
          type: 'error',
          title: 'Missing Information',
          message: `${employeeName} is missing: ${missingFields.join(', ')}`,
          employeeId: employeeId,
          timestamp: new Date().toISOString(),
          time: new Date().toLocaleString(),
          read: false,
          data: { employeeId: employeeId }
        });
      }
    });
    
    return notifications;
  };

  return { generateMissingInfoNotifications };
};
