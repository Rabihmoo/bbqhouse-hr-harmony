
import { Notification, LeaveAllowance } from "@/types/notification";

export const useLeaveNotifications = () => {
  const generateLeaveNotifications = (employees: any[]): Notification[] => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const notifications: Notification[] = [];
    
    employees.forEach(employee => {
      const employeeId = employee.id;
      const employeeName = employee.fullName;
      
      // Annual leave eligibility notification (if 1+ year employed and 0 leave days)
      if (employee.hireDate) {
        if (employee.remainingLeaves === 0) {
          notifications.push({
            id: `leave-${employeeId}`,
            type: 'info',
            title: 'Annual Leave Eligible',
            message: `${employeeName} is eligible for annual leave.`,
            employeeId: employeeId,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleString(),
            read: false,
            data: { employeeId: employeeId }
          });
        }
      }
      
      // Check for unused leave allowances
      if (employee.leaveAllowances && employee.leaveAllowances.length > 0) {
        employee.leaveAllowances.forEach((allowance: LeaveAllowance) => {
          if (allowance.status === 'unused') {
            notifications.push({
              id: `unused-leave-${employeeId}-${allowance.year}`,
              type: 'warning',
              title: 'Unused Annual Leave',
              message: `${employeeName} has not taken any of their ${allowance.daysEntitled} days of leave for ${allowance.year}.`,
              employeeId: employeeId,
              timestamp: new Date().toISOString(),
              time: new Date().toLocaleString(),
              read: false,
              data: { employeeId: employeeId }
            });
          } else if (allowance.status === 'partially-used' && allowance.year < currentYear) {
            notifications.push({
              id: `partial-leave-${employeeId}-${allowance.year}`,
              type: 'info',
              title: 'Partially Used Leave',
              message: `${employeeName} has ${allowance.remaining} remaining days of leave from ${allowance.year}.`,
              employeeId: employeeId,
              timestamp: new Date().toISOString(),
              time: new Date().toLocaleString(),
              read: false,
              data: { employeeId: employeeId }
            });
          }
        });
      }
    });
    
    return notifications;
  };

  return { generateLeaveNotifications };
};
