
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
    // Ensure we're getting and preserving all employee data including status and company
    console.log("Editing employee with data:", data);
    
    // Find the existing employee to preserve any fields not in the form
    const existingEmployee = employees.find(emp => emp.id === data.id) || {};
    
    // Create updated employee with preserved fields and new data
    const updatedEmployee = { 
      ...existingEmployee, 
      ...data,
      // Explicitly ensure status and company are updated
      status: data.status,
      company: data.company
    };
    
    console.log("Updated employee data:", updatedEmployee);
    
    const updatedEmployees = employees.map(emp => 
      emp.id === data.id ? updatedEmployee : emp
    );
    
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
          
          return {
            ...allowance,
            daysTaken: allowance.daysTaken + daysToDeduct,
            remaining: allowance.remaining - daysToDeduct,
            status: allowance.remaining - daysToDeduct === 0 ? 'fully-used' : 'partially-used'
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
    getEmployeesByDepartment,
    filterEmployeesByCompany,
  };
};
