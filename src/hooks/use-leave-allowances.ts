
import { useEffect } from "react";
import { parseISO } from "date-fns";
import { LeaveAllowance } from "@/types/notification";
import { calculateLeaveAllowance, getEmployeeYearsOfService } from "@/lib/data";

export const useLeaveAllowances = (employees: any[], setEmployees: React.Dispatch<React.SetStateAction<any[]>>) => {
  // Calculate and update leave allowances for all employees
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    const updatedEmployees = employees.map(employee => {
      if (!employee.hireDate) return employee;
      
      const hireDate = parseISO(employee.hireDate);
      const yearsEmployed = getEmployeeYearsOfService(employee.hireDate);
      
      // Skip if less than a year employed
      if (yearsEmployed < 1) return employee;
      
      // Initialize arrays if they don't exist
      const leaveAllowances = employee.leaveAllowances || [];
      const leaveRecords = employee.leaveRecords || [];
      
      // Check each employment year starting from hire year
      const updatedAllowances: LeaveAllowance[] = [];
      
      for (let year = hireDate.getFullYear() + 1; year <= currentYear; year++) {
        // Check if we already have an allowance record for this year
        const existingAllowance = leaveAllowances.find(a => a.year === year);
        
        if (existingAllowance) {
          // Update existing allowance with current records
          const recordsForYear = leaveRecords.filter(r => r.year === year && r.type === 'annual');
          const daysTaken = recordsForYear.reduce((sum, record) => sum + record.days, 0);
          
          const yearsAtStartOfYear = year - hireDate.getFullYear();
          const daysEntitled = calculateLeaveAllowance(yearsAtStartOfYear);
          const remaining = daysEntitled - daysTaken;
          
          updatedAllowances.push({
            ...existingAllowance,
            daysEntitled,
            daysTaken,
            remaining,
            status: daysTaken === 0 ? 'unused' : 
                   daysTaken < daysEntitled ? 'partially-used' : 'fully-used'
          });
        } else {
          // Create new allowance record
          const yearsAtStartOfYear = year - hireDate.getFullYear();
          const daysEntitled = calculateLeaveAllowance(yearsAtStartOfYear);
          
          // Check if there are any leave records for this year
          const recordsForYear = leaveRecords.filter(r => r.year === year && r.type === 'annual');
          const daysTaken = recordsForYear.reduce((sum, record) => sum + record.days, 0);
          const remaining = daysEntitled - daysTaken;
          
          updatedAllowances.push({
            year,
            daysEntitled,
            daysTaken,
            remaining,
            status: daysTaken === 0 ? 'unused' : 
                   daysTaken < daysEntitled ? 'partially-used' : 'fully-used'
          });
        }
      }
      
      return {
        ...employee,
        leaveAllowances: updatedAllowances,
        leaveRecords: leaveRecords
      };
    });
    
    setEmployees(updatedEmployees);
  }, []);
};
