
import { useToast } from "@/hooks/use-toast";
import { LeaveRecord } from "@/types/notification";
import { sendEmailNotification, exportToExcel } from "@/utils/notificationService";

export const useEmployeeLeaveOperations = (
  employees: any[],
  setEmployees: React.Dispatch<React.SetStateAction<any[]>>,
  saveEmployeesToLocalStorage: (updatedEmployees: any[]) => void
) => {
  const { toast } = useToast();

  const handleAddLeaveRecord = async (employeeId: string, leaveRecord: Omit<LeaveRecord, 'id'>) => {
    // Here we change to use Promise.all with map and make each callback async
    const updatedEmployees = await Promise.all(employees.map(async emp => {
      if (emp.id === employeeId) {
        const leaveRecords = emp.leaveRecords || [];
        const newRecord = {
          ...leaveRecord,
          id: `leave-${Date.now()}`
        };
        
        const allowances = [...(emp.leaveAllowances || [])].sort((a, b) => a.year - b.year);
        
        let remainingDaysToDeduct = newRecord.days;
        
        const updatedAllowances = allowances.map(allowance => {
          if (remainingDaysToDeduct <= 0 || allowance.remaining <= 0) {
            return allowance;
          }
          
          const daysToDeduct = Math.min(allowance.remaining, remainingDaysToDeduct);
          remainingDaysToDeduct -= daysToDeduct;
          
          const newRemaining = allowance.remaining - daysToDeduct;
          const newStatus = newRemaining === 0 ? 'fully-used' : 'partially-used';
          
          if (newRemaining === 0) {
            toast({
              title: "Leave Fully Used",
              description: `${emp.fullName}'s leave for ${allowance.year} has been fully used.`,
            });
          }
          
          return {
            ...allowance,
            daysTaken: allowance.daysTaken + daysToDeduct,
            remaining: newRemaining,
            status: newStatus
          };
        });
        
        if (newRecord.type === 'annual') {
          const recordWithName = {
            ...newRecord,
            employeeName: emp.fullName
          };
          
          // Now we can use await here because the parent callback is async
          try {
            await sendEmailNotification('leave', recordWithName);
            await exportToExcel('leave', recordWithName);
          } catch (error) {
            console.error('Error sending leave notifications:', error);
          }
        }
        
        return {
          ...emp,
          leaveRecords: [...leaveRecords, newRecord],
          leaveAllowances: updatedAllowances
        };
      }
      return emp;
    }));
    
    setEmployees(updatedEmployees);
    saveEmployeesToLocalStorage(updatedEmployees);
    toast({
      title: "Leave record added",
      description: `Leave record has been added successfully.`,
    });
  };

  return {
    handleAddLeaveRecord,
  };
};
