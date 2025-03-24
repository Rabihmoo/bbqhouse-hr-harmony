
import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { employees as initialEmployeesData } from "@/lib/data";
import EmployeeForm from "@/components/employees/EmployeeForm";
import EmployeesList from "@/components/employees/EmployeesList";
import PageHeader from "@/components/employees/PageHeader";
import AttendanceUploader from "@/components/employees/AttendanceUploader";
import DepartmentSummary from "@/components/employees/DepartmentSummary";
import { useEmployeeOperations } from "@/hooks/use-employee-operations";
import { useEmployeeNotifications } from "@/hooks/use-employee-notifications";
import { useLeaveAllowances } from "@/hooks/use-leave-allowances";
import { parseISO, differenceInYears } from "date-fns";

const LOCAL_STORAGE_KEY = 'restaurant-employees-data';

const Employees = () => {
  // Load initial data from localStorage if available, otherwise use the default data
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedEmployees ? JSON.parse(savedEmployees) : initialEmployeesData;
  });
  
  const attendanceUploaderRef = useRef<HTMLDivElement>(null);

  // Save to localStorage whenever employees data changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  // Use the extracted hooks for employee operations
  const {
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
  } = useEmployeeOperations(employees, setEmployees, LOCAL_STORAGE_KEY);

  // Use the notifications hook
  const { notifications } = useEmployeeNotifications(employees);

  // Use the leave allowances hook
  useLeaveAllowances(employees, setEmployees);

  // Handle notification click to open the employee edit form
  const handleNotificationClick = (notification: any) => {
    if (notification.employeeId) {
      const employee = employees.find(emp => emp.id === notification.employeeId);
      if (employee) {
        setEditingEmployee(employee);
      }
    }
  };

  const handleAttendanceReport = (reportData: any) => {
    // In a production app, this would process the attendance report data
    console.log("Attendance report generated:", reportData);
  };

  // Get the department counts for the summary component
  const departmentCounts = getEmployeesByDepartment();

  return (
    <DashboardLayout 
      title="Employees" 
      subtitle="Manage employee records"
      notifications={notifications}
      onNotificationClick={handleNotificationClick}
    >
      <PageHeader 
        employeeCount={employees.length} 
        onAddEmployee={() => setShowAddForm(true)}
        onUploadData={() => attendanceUploaderRef.current?.click()}
      />

      <DepartmentSummary departmentCounts={departmentCounts} />

      <EmployeesList 
        employees={employees} 
        onRowClick={handleRowClick} 
      />

      <div ref={attendanceUploaderRef} className="hidden">
        <AttendanceUploader onFileUploaded={handleAttendanceReport} />
      </div>

      {/* Add Employee Form */}
      <EmployeeForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddEmployee}
      />

      {/* Edit Employee Form */}
      {editingEmployee && (
        <EmployeeForm
          open={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSubmit={handleEditEmployee}
          initialData={editingEmployee}
          isEditing
        />
      )}
    </DashboardLayout>
  );
};

export default Employees;
