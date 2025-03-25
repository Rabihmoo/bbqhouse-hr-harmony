
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LOCAL_STORAGE_KEY = 'restaurant-employees-data';

const Employees = () => {
  // Load initial data from localStorage if available, otherwise use the default data
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedEmployees ? JSON.parse(savedEmployees) : initialEmployeesData;
  });
  
  const [activeTab, setActiveTab] = useState("active");
  const attendanceUploaderRef = useRef<HTMLDivElement>(null);

  // Refresh data when local storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedEmployees = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
    filterEmployeesByCompany,
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

  // Filter employees by status - corrected filtering
  const activeEmployees = employees.filter(e => e.status === 'Active' || e.status === 'On Leave');
  const inactiveEmployees = employees.filter(e => e.status === 'Inactive' || e.status === 'Terminated');

  // Get the department counts for the summary component
  const departmentCounts = getEmployeesByDepartment();

  // Companies for filtering
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  
  // Apply company filter to the correct employee list based on active tab
  const filteredEmployees = selectedCompany 
    ? (activeTab === "active" ? activeEmployees : inactiveEmployees).filter(emp => emp.company === selectedCompany)
    : (activeTab === "active" ? activeEmployees : inactiveEmployees);

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
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
      />

      <DepartmentSummary departmentCounts={departmentCounts} />

      <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden mb-6">
        <Tabs 
          defaultValue="active" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Employees ({activeEmployees.length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive Employees ({inactiveEmployees.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="mt-0">
            <EmployeesList 
              employees={filteredEmployees} 
              onRowClick={handleRowClick} 
            />
          </TabsContent>
          
          <TabsContent value="inactive" className="mt-0">
            <EmployeesList 
              employees={filteredEmployees} 
              onRowClick={handleRowClick} 
            />
          </TabsContent>
        </Tabs>
      </div>

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
