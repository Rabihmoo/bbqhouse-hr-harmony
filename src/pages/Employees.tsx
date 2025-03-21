
import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { employees as initialEmployeesData } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";
import EmployeeForm from "@/components/employees/EmployeeForm";
import EmployeesList from "@/components/employees/EmployeesList";
import PageHeader from "@/components/employees/PageHeader";
import AttendanceUploader from "@/components/employees/AttendanceUploader";
import { format, addYears, differenceInYears, parseISO } from "date-fns";

const LOCAL_STORAGE_KEY = 'restaurant-employees-data';

const Employees = () => {
  // Load initial data from localStorage if available, otherwise use the default data
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedEmployees ? JSON.parse(savedEmployees) : initialEmployeesData;
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const { toast } = useToast();
  const attendanceUploaderRef = useRef<HTMLDivElement>(null);

  // Save to localStorage whenever employees data changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  // We'll handle anniversaries in a simplified way for now
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

  const handleAddEmployee = (data: any) => {
    const newEmployee = {
      ...data,
      id: String(employees.length + 1),
      status: 'Active',
      remainingLeaves: 0, // Start with 0 leave days for new employees
    };
    
    setEmployees([...employees, newEmployee]);
    setShowAddForm(false);
    
    toast({
      title: "Employee added",
      description: `${data.fullName} has been successfully added and saved.`,
    });
    
    // Check anniversaries after adding
    checkEmployeeAnniversaries();
  };

  const handleEditEmployee = (data: any) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === data.id ? { ...emp, ...data } : emp
    );
    
    setEmployees(updatedEmployees);
    setEditingEmployee(null);
    
    toast({
      title: "Employee updated",
      description: `${data.fullName}'s information has been updated and saved.`,
    });
  };

  const handleRowClick = (employee: any) => {
    setEditingEmployee(employee);
  };

  const handleAttendanceReport = (reportData: any) => {
    // In a production app, this would process the attendance report data
    console.log("Attendance report generated:", reportData);
  };

  // Get employees grouped by department
  const getEmployeesByDepartment = () => {
    const departments = ["Kitchen", "Sala", "Bar", "Cleaning", "Takeaway"];
    const result: { [key: string]: number } = {};
    
    departments.forEach(dept => {
      result[dept] = employees.filter(emp => emp.department === dept).length;
    });
    
    return result;
  };

  const departmentCounts = getEmployeesByDepartment();

  return (
    <DashboardLayout title="Employees" subtitle="Manage employee records">
      <PageHeader 
        employeeCount={employees.length} 
        onAddEmployee={() => setShowAddForm(true)}
        onUploadData={() => attendanceUploaderRef.current?.click()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {Object.entries(departmentCounts).map(([dept, count]) => (
          <div key={dept} className="bg-white dark:bg-black/40 rounded-lg p-4 shadow-sm">
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Department</h3>
            <p className="text-lg font-bold">{dept}</p>
            <p className="text-sm mt-1">{count} employees</p>
          </div>
        ))}
      </div>

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
