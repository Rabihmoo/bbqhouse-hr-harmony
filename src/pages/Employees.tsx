
import { useState, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { employees as employeesData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import EmployeeForm from "@/components/employees/EmployeeForm";
import EmployeesList from "@/components/employees/EmployeesList";
import PageHeader from "@/components/employees/PageHeader";
import AttendanceUploader from "@/components/employees/AttendanceUploader";

const Employees = () => {
  const [employees, setEmployees] = useState(employeesData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const { toast } = useToast();
  const attendanceUploaderRef = useRef<HTMLInputElement>(null);

  const handleAddEmployee = (data: any) => {
    const newEmployee = {
      ...data,
      id: String(employees.length + 1),
      status: 'Active',
      remainingLeaves: 30,
    };
    
    setEmployees([...employees, newEmployee]);
    setShowAddForm(false);
    
    toast({
      title: "Employee added",
      description: `${data.fullName} has been successfully added.`,
    });
  };

  const handleEditEmployee = (data: any) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === data.id ? { ...emp, ...data } : emp
    );
    
    setEmployees(updatedEmployees);
    setEditingEmployee(null);
    
    toast({
      title: "Employee updated",
      description: `${data.fullName}'s information has been updated.`,
    });
  };

  const handleRowClick = (employee: any) => {
    setEditingEmployee(employee);
  };

  const handleFileUpload = () => {
    if (attendanceUploaderRef.current) {
      attendanceUploaderRef.current.click();
    }
  };

  return (
    <DashboardLayout title="Employees" subtitle="Manage employee records">
      <PageHeader 
        employeeCount={employees.length} 
        onAddEmployee={() => setShowAddForm(true)}
        onUploadData={handleFileUpload}
      />

      <EmployeesList 
        employees={employees} 
        onRowClick={handleRowClick} 
      />

      <AttendanceUploader />

      {/* Add Employee Form */}
      <EmployeeForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddEmployee}
      />

      {/* Edit Employee Form */}
      <EmployeeForm
        open={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        onSubmit={handleEditEmployee}
        initialData={editingEmployee}
        isEditing
      />
    </DashboardLayout>
  );
};

export default Employees;
