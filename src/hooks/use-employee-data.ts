
import { useState, useEffect } from 'react';
import { employees, leaveRequests } from '@/lib/data';

export const useEmployeeData = (activeOnly = true) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [leavesList, setLeavesList] = useState([]);
  
  // Load employee data
  useEffect(() => {
    // Get data from localStorage if available, otherwise use the imported data
    const storedEmployees = localStorage.getItem('bbq-employees');
    const storedLeaves = localStorage.getItem('bbq-leaves');
    
    const employeeData = storedEmployees ? JSON.parse(storedEmployees) : employees;
    const leavesData = storedLeaves ? JSON.parse(storedLeaves) : leaveRequests;
    
    // Filter employees if activeOnly is true
    const filteredEmployees = activeOnly 
      ? employeeData.filter(emp => emp.status === 'Active' || emp.status === 'On Leave')
      : employeeData;
      
    // Filter leaves to only include active employees if activeOnly is true
    const relevantEmployeeIds = activeOnly 
      ? employeeData.filter(emp => emp.status === 'Active' || emp.status === 'On Leave').map(emp => emp.id)
      : employeeData.map(emp => emp.id);
      
    const filteredLeaves = leavesData.filter(leave => 
      relevantEmployeeIds.includes(leave.employeeId)
    );
    
    setEmployeeList(filteredEmployees);
    setLeavesList(filteredLeaves);
  }, [activeOnly]);

  return {
    employees: employeeList,
    leaveRequests: leavesList
  };
};
