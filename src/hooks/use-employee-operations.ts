
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LeaveRecord } from "@/types/notification";
import { parseISO, differenceInYears } from "date-fns";

export const useEmployeeOperations = (
  employees: any[],
  setEmployees: React.Dispatch<React.SetStateAction<any[]>>,
  LOCAL_STORAGE_KEY: string
) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const { toast } = useToast();

  // Save to localStorage whenever employees data changes
  const saveEmployeesToLocalStorage = (updatedEmployees: any[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEmployees));
    // Trigger storage event for real-time updates across tabs
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddEmployee = (data: any) => {
    const newEmployee = {
      ...data,
      id: String(employees.length + 1),
      status: data.status || 'Active',
      company: data.company || '',
      remainingLeaves: 0, // Start with 0 leave days for new employees
    };
    
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    saveEmployeesToLocalStorage(updatedEmployees);
    setShowAddForm(false);
    
    toast({
      title: "Employee added",
      description: `${data.fullName} has been successfully added and saved.`,
    });
  };

  const handleEditEmployee = (data: any) => {
    // Log complete received data
    console.log("Editing employee with data:", data);
    console.log("Status value in edit:", data.status);
    console.log("Company value in edit:", data.company);
    console.log("Address value in edit:", data.address);
    console.log("Email value in edit:", data.email);
    console.log("Phone value in edit:", data.phone);
    console.log("Salary value in edit:", data.salary);
    
    // Find the existing employee to preserve any fields not in the form
    const existingEmployee = employees.find(emp => emp.id === data.id) || {};
    
    // Create updated employee with preserved fields and new data
    const updatedEmployee = { 
      ...existingEmployee, 
      ...data,
      // Explicitly ensure these fields are updated from the form data
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

  // Handle adding a leave record to an employee - fixed to deduct from oldest year first
  // Update this to mark the year as "fully-used" when used
  const handleAddLeaveRecord = (employeeId: string, leaveRecord: Omit<LeaveRecord, 'id'>) => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === employeeId) {
        const leaveRecords = emp.leaveRecords || [];
        const newRecord = {
          ...leaveRecord,
          id: `leave-${Date.now()}`
        };
        
        // Get the employee's leave allowances and sort by oldest year first
        const allowances = [...(emp.leaveAllowances || [])].sort((a, b) => a.year - b.year);
        
        // Deduct leave days from the oldest year first
        let remainingDaysToDeduct = newRecord.days;
        
        const updatedAllowances = allowances.map(allowance => {
          if (remainingDaysToDeduct <= 0 || allowance.remaining <= 0) {
            return allowance;
          }
          
          const daysToDeduct = Math.min(allowance.remaining, remainingDaysToDeduct);
          remainingDaysToDeduct -= daysToDeduct;
          
          // Mark as fully-used if all days are used
          const newRemaining = allowance.remaining - daysToDeduct;
          const newStatus = newRemaining === 0 ? 'fully-used' : 'partially-used';
          
          // Create notification for fully used leave
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
        
        return {
          ...emp,
          leaveRecords: [...leaveRecords, newRecord],
          leaveAllowances: updatedAllowances
        };
      }
      return emp;
    });
    
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
        
        // Check if today is their work anniversary
        const isAnniversaryToday = 
          today.getDate() === hireDate.getDate() && 
          today.getMonth() === hireDate.getMonth();
        
        // Send anniversary notification
        if (isAnniversaryToday && yearsEmployed > 0) {
          toast({
            title: `Work Anniversary: ${employee.fullName}`,
            description: `Today marks ${yearsEmployed} year${yearsEmployed > 1 ? 's' : ''} since ${employee.fullName} joined.`,
          });
        }
      }
    });
  };

  // Check for missing documents and send notifications
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
    
    departments.forEach(dept => {
      result[dept] = employees.filter(emp => emp.department === dept).length;
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
