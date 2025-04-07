
import { parseISO, isBefore } from "date-fns";
import { Notification } from "@/types/notification";

export const useDocumentNotifications = () => {
  const generateDocumentNotifications = (employees: any[]): Notification[] => {
    const today = new Date();
    const notifications: Notification[] = [];

    employees.forEach(employee => {
      const employeeId = employee.id;
      const employeeName = employee.fullName;

      // Check for expired BI
      if (employee.biValidUntil) {
        const biExpiryDate = parseISO(employee.biValidUntil);
        if (isBefore(biExpiryDate, today) || !employee.biValid) {
          notifications.push({
            id: `bi-${employeeId}`,
            type: 'warning',
            title: 'BI Expired',
            message: `${employeeName}'s BI has expired or is invalid.`,
            employeeId: employeeId,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleString(),
            read: false,
            data: { employeeId: employeeId }
          });
        }
      }
      
      // Check for expired Health Card
      if (employee.healthCardValidUntil) {
        const healthCardExpiryDate = parseISO(employee.healthCardValidUntil);
        if (isBefore(healthCardExpiryDate, today) || !employee.healthCardValid) {
          notifications.push({
            id: `health-${employeeId}`,
            type: 'warning',
            title: 'Health Card Expired',
            message: `${employeeName}'s Health Card has expired or is invalid.`,
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

  return { generateDocumentNotifications };
};
