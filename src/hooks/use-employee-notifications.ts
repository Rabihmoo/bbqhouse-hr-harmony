
import { useEffect, useState } from "react";
import { format, addYears, differenceInYears, parseISO, isBefore } from "date-fns";
import { Notification } from "@/types/notification";

export const useEmployeeNotifications = (employees: any[]) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications based on employee data
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const newNotifications: Notification[] = [];
    
    employees.forEach(employee => {
      const employeeId = employee.id;
      const employeeName = employee.fullName;
      
      // Check for annual leave eligibility and unused leave
      if (employee.hireDate) {
        const hireDate = parseISO(employee.hireDate);
        const yearsEmployed = differenceInYears(today, hireDate);
        
        // Annual leave eligibility notification (if 1+ year employed and 0 leave days)
        if (yearsEmployed >= 1 && employee.remainingLeaves === 0) {
          newNotifications.push({
            id: `leave-${employeeId}`,
            type: 'info',
            title: 'Annual Leave Eligible',
            message: `${employeeName} is eligible for annual leave.`,
            employeeId: employeeId,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleString(),
            read: false,
            actionType: 'view-employee'
          });
        }
        
        // Check for unused leave allowances
        if (employee.leaveAllowances && employee.leaveAllowances.length > 0) {
          employee.leaveAllowances.forEach((allowance: any) => {
            if (allowance.status === 'unused') {
              newNotifications.push({
                id: `unused-leave-${employeeId}-${allowance.year}`,
                type: 'warning',
                title: 'Unused Annual Leave',
                message: `${employeeName} has not taken any of their ${allowance.daysEntitled} days of leave for ${allowance.year}.`,
                employeeId: employeeId,
                timestamp: new Date().toISOString(),
                time: new Date().toLocaleString(),
                read: false,
                actionType: 'view-employee'
              });
            } else if (allowance.status === 'partially-used' && allowance.year < currentYear) {
              newNotifications.push({
                id: `partial-leave-${employeeId}-${allowance.year}`,
                type: 'info',
                title: 'Partially Used Leave',
                message: `${employeeName} has ${allowance.remaining} remaining days of leave from ${allowance.year}.`,
                employeeId: employeeId,
                timestamp: new Date().toISOString(),
                time: new Date().toLocaleString(),
                read: false,
                actionType: 'view-employee'
              });
            }
          });
        }
        
        // Work anniversary notification
        const isAnniversaryToday = 
          today.getDate() === hireDate.getDate() && 
          today.getMonth() === hireDate.getMonth();
        
        if (isAnniversaryToday && yearsEmployed > 0) {
          newNotifications.push({
            id: `anniversary-${employeeId}`,
            type: 'success',
            title: 'Work Anniversary',
            message: `Today marks ${yearsEmployed} year${yearsEmployed > 1 ? 's' : ''} since ${employeeName} joined.`,
            employeeId: employeeId,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleString(),
            read: false,
            actionType: 'view-employee'
          });
        }
      }
      
      // Check for expired BI
      if (employee.biValidUntil) {
        const biExpiryDate = parseISO(employee.biValidUntil);
        if (isBefore(biExpiryDate, today) || !employee.biValid) {
          newNotifications.push({
            id: `bi-${employeeId}`,
            type: 'warning',
            title: 'BI Expired',
            message: `${employeeName}'s BI has expired or is invalid.`,
            employeeId: employeeId,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleString(),
            read: false,
          });
        }
      }
      
      // Check for expired Health Card
      if (employee.healthCardValidUntil) {
        const healthCardExpiryDate = parseISO(employee.healthCardValidUntil);
        if (isBefore(healthCardExpiryDate, today) || !employee.healthCardValid) {
          newNotifications.push({
            id: `health-${employeeId}`,
            type: 'warning',
            title: 'Health Card Expired',
            message: `${employeeName}'s Health Card has expired or is invalid.`,
            employeeId: employeeId,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleString(),
            read: false,
          });
        }
      }
      
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
        newNotifications.push({
          id: `missing-${employeeId}`,
          type: 'error',
          title: 'Missing Information',
          message: `${employeeName} is missing: ${missingFields.join(', ')}`,
          employeeId: employeeId,
          timestamp: new Date().toISOString(),
          time: new Date().toLocaleString(),
          read: false,
        });
      }
    });
    
    setNotifications(newNotifications);
  }, [employees]);

  return { notifications };
};
