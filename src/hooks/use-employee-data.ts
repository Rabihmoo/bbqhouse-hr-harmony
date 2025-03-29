
import { useState, useEffect } from 'react';
import { employees, leaveRequests } from '@/lib/data';

export const useEmployeeData = (activeOnly = true, companyFilter?: string) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [leavesList, setLeavesList] = useState([]);
  
  // Load employee data
  useEffect(() => {
    // Get data from localStorage if available, otherwise use the imported data
    const storedEmployees = localStorage.getItem('bbq-employees') || localStorage.getItem('restaurant-employees-data');
    const storedLeaves = localStorage.getItem('bbq-leaves');
    
    const employeeData = storedEmployees ? JSON.parse(storedEmployees) : employees;
    const leavesData = storedLeaves ? JSON.parse(storedLeaves) : leaveRequests;
    
    // Apply active filter first
    let filteredEmployees = activeOnly 
      ? employeeData.filter(emp => emp.status === 'Active')
      : employeeData;
    
    // Then apply company filter if provided
    if (companyFilter) {
      filteredEmployees = filteredEmployees.filter(emp => emp.company === companyFilter);
    }
    
    // Filter leaves to only include employees that match our current filters
    const relevantEmployeeIds = filteredEmployees.map(emp => emp.id);
    
    const filteredLeaves = leavesData.filter(leave => 
      relevantEmployeeIds.includes(leave.employeeId)
    );
    
    setEmployeeList(filteredEmployees);
    setLeavesList(filteredLeaves);
    
    // Add event listener to update data when localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'bbq-employees' || e.key === 'restaurant-employees-data' || e.key === 'bbq-leaves') {
        window.location.reload(); // Force reload to ensure data consistency
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [activeOnly, companyFilter]);

  return {
    employees: employeeList,
    leaveRequests: leavesList
  };
};
