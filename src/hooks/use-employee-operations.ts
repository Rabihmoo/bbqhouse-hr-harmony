
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LeaveRecord } from "@/types/notification";
import { parseISO, differenceInYears } from "date-fns";
import { sendEmailNotification, exportToExcel } from "@/utils/notificationService";

export const useEmployeeOperations = (
  employees: any[],
  setEmployees: React.Dispatch<React.SetStateAction<any[]>>,
  LOCAL_STORAGE_KEY: string
) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedEmployees = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedEmployees) {
      try {
        const parsedEmployees = JSON.parse(storedEmployees);
        setEmployees(parsedEmployees);
      } catch (error) {
        console.error("Error parsing stored employees:", error);
      }
    }
  }, [LOCAL_STORAGE_KEY, setEmployees]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_KEY && event.newValue) {
        try {
          const parsedEmployees = JSON.parse(event.newValue);
          setEmployees(parsedEmployees);
        } catch (error) {
          console.error("Error parsing stored employees from storage event:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [LOCAL_STORAGE_KEY, setEmployees]);

  const saveEmployeesToLocalStorage = (updatedEmployees: any[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEmployees));
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddEmployee = async (data: any) => {
    const newEmployee = {
      ...data,
      id: String(employees.length + 1),
      status: data.status || 'Active',
      company: data.company || '',
      remainingLeaves: 0,
    };
    
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    saveEmployeesToLocalStorage(updatedEmployees);
    setShowAddForm(false);
    
    toast({
      title: "Employee added",
      description: `${data.fullName} has been successfully added and saved.`,
    });
    
    await sendEmailNotification('employee', newEmployee);
    await exportToExcel('employee', newEmployee);
  };

  const handleEditEmployee = (data: any) => {
    console.log("Editing employee with data:", data);
    console.log("Status value in edit:", data.status);
    console.log("Company value in edit:", data.company);
    console.log("Address value in edit:", data.address);
    console.log("Email value in edit:", data.email);
    console.log("Phone value in edit:", data.phone);
    console.log("Salary value in edit:", data.salary);
    
    const existingEmployee = employees.find(emp => emp.id === data.id) || {};
    
    const updatedEmployee = { 
      ...existingEmployee, 
      ...data,
      status: data.status,
      company: data.company,
      address: data.address,
      secondAddress: data.secondAddress,
      email: data.email,
      phone: data.phone,
      salary: data.salary,
      salaryStructure: data.salaryStructure
    };
    
    console.log("Updated employee data:", updatedEmployee);
    
    const updatedEmployees = employees.map(emp => 
      emp.id === data.id ? updatedEmployee : emp
    );
    
    console.log("Saving updated employees:", updatedEmployees);
    setEmployees(updatedEmployees);
    saveEmployeesToLocalStorage(updatedEmployees);
    setEditingEmployee(null);
    
    toast({
      title: "Employee updated",
      description: `${data.fullName}'s information has been updated and saved.`,
    });
  };

  const handleRowClick = (employee: any) => {
    setEditingEmployee(employee);
  };

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

  const checkEmployeeAnniversaries = () => {
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

  const checkMissingDocuments = () => {
    employees.forEach(employee => {
      if (!employee.documents) return;
      
      const requiredDocs = ['bi', 'healthCard', 'tax', 'nuit', 'declaration', 'cv'];
      const missingDocs = requiredDocs.filter(doc => 
        !employee.documents[doc] || !employee.documents[doc].uploaded
      );
      
      if (missingDocs.length > 0) {
        toast({
          title: "Missing Documents",
          description: `${employee.fullName} is missing ${missingDocs.length} document(s): ${missingDocs.join(', ')}`,
          variant: "destructive",
        });
      }
    });
  };

  const getEmployeesByDepartment = () => {
    const departments = ["Kitchen", "Sala", "Bar", "Cleaning", "Takeaway"];
    const result: { [key: string]: number } = {};
    
    const activeEmployees = employees.filter(emp => emp.status === 'Active' || emp.status === 'On Leave');
    
    departments.forEach(dept => {
      result[dept] = activeEmployees.filter(emp => emp.department === dept).length;
    });
    
    return result;
  };

  const filterEmployeesByCompany = (company: string | null) => {
    if (!company) return employees;
    return employees.filter(emp => emp.company === company);
  };

  return {
    showAddForm,
    setShowAddForm,
    editingEmployee,
    setEditingEmployee,
    handleAddEmployee,
    handleEditEmployee,
    handleRowClick,
    handleAddLeaveRecord,
    checkEmployeeAnniversaries,
    checkMissingDocuments,
    getEmployeesByDepartment,
    filterEmployeesByCompany,
  };
};
