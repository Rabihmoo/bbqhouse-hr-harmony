
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendEmailNotification, exportToExcel } from "@/utils/notificationService";

export const useEmployeeBasicOperations = (
  employees: any[],
  setEmployees: React.Dispatch<React.SetStateAction<any[]>>,
  saveEmployeesToLocalStorage: (updatedEmployees: any[]) => void
) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const { toast } = useToast();

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
    filterEmployeesByCompany,
  };
};
