
import { parseISO, differenceInYears } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export const useEmployeeAnalytics = () => {
  const { toast } = useToast();

  const checkEmployeeAnniversaries = (employees: any[]) => {
    const today = new Date();
    
    employees.forEach(employee => {
      if (employee.hireDate) {
        const hireDate = parseISO(employee.hireDate);
        const yearsEmployed = differenceInYears(today, hireDate);
        
        const isAnniversaryToday = 
          today.getDate() === hireDate.getDate() && 
          today.getMonth() === hireDate.getMonth();
        
        if (isAnniversaryToday && yearsEmployed > 0) {
          toast({
            title: `Work Anniversary: ${employee.fullName}`,
            description: `Today marks ${yearsEmployed} year${yearsEmployed > 1 ? 's' : ''} since ${employee.fullName} joined.`,
          });
        }
      }
    });
  };

  const getEmployeesByDepartment = (employees: any[] = []) => {
    const departments = ["Kitchen", "Sala", "Bar", "Cleaning", "Takeaway"];
    const result: { [key: string]: number } = {};
    
    const activeEmployees = employees.filter(emp => emp.status === 'Active' || emp.status === 'On Leave');
    
    departments.forEach(dept => {
      result[dept] = activeEmployees.filter(emp => emp.department === dept).length;
    });
    
    return result;
  };

  return {
    checkEmployeeAnniversaries,
    getEmployeesByDepartment,
  };
};
