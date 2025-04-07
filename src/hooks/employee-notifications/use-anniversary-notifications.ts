
import { parseISO, differenceInYears } from "date-fns";
import { Notification } from "@/types/notification";

export const useAnniversaryNotifications = () => {
  const generateAnniversaryNotifications = (employees: any[]): Notification[] => {
    const today = new Date();
    const notifications: Notification[] = [];
    
    employees.forEach(employee => {
      const employeeId = employee.id;
      const employeeName = employee.fullName;
      
      // Work anniversary notification
      if (employee.hireDate) {
        const hireDate = parseISO(employee.hireDate);
        const yearsEmployed = differenceInYears(today, hireDate);
        
        const isAnniversaryToday = 
          today.getDate() === hireDate.getDate() && 
          today.getMonth() === hireDate.getMonth();
        
        if (isAnniversaryToday && yearsEmployed > 0) {
          notifications.push({
            id: `anniversary-${employeeId}`,
            type: 'success',
            title: 'Work Anniversary',
            message: `Today marks ${yearsEmployed} year${yearsEmployed > 1 ? 's' : ''} since ${employeeName} joined.`,
            employeeId: employeeId,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleString(),
            read: false,
            data: { employeeId: employeeId }
          });
        }
      }
    });
    
    return notifications;
  };

  return { generateAnniversaryNotifications };
};
