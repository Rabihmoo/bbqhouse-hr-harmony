
import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { employees as employeesData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import EmployeeForm from "@/components/employees/EmployeeForm";
import EmployeesList from "@/components/employees/EmployeesList";
import PageHeader from "@/components/employees/PageHeader";
import AttendanceUploader from "@/components/employees/AttendanceUploader";
import { format, addYears, differenceInYears, parseISO } from "date-fns";

const Employees = () => {
  const [employees, setEmployees] = useState(employeesData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const { toast } = useToast();
  const attendanceUploaderRef = useRef<HTMLDivElement>(null);

  // Check for employee work anniversaries and leave allocation
  useEffect(() => {
    // Check once on load and then daily
    checkEmployeeAnniversaries();
    const interval = setInterval(checkEmployeeAnniversaries, 86400000); // 24 hours
    
    return () => clearInterval(interval);
  }, [employees]);

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
            description: `Today marks ${yearsEmployed} year${yearsEmployed > 1 ? 's' : ''} since ${employee.fullName} joined. Consider reviewing their leave allocation.`,
          });
          
          // Update leave allocation based on years of service
          const updatedEmployee = { ...employee };
          
          // Apply leave allocation rules
          if (yearsEmployed === 1) {
            updatedEmployee.remainingLeaves = 12;
            toast({
              title: "Leave Allocation Updated",
              description: `${employee.fullName} has completed 1 year and is now eligible for 12 annual leave days.`
            });
          } else if (yearsEmployed >= 2 && employee.remainingLeaves < 30) {
            updatedEmployee.remainingLeaves = 30;
            toast({
              title: "Leave Allocation Updated",
              description: `${employee.fullName} has completed ${yearsEmployed} years and is now eligible for 30 annual leave days.`
            });
          }
          
          // Update employee in state if changed
          if (updatedEmployee.remainingLeaves !== employee.remainingLeaves) {
            setEmployees(prev => 
              prev.map(emp => emp.id === employee.id ? updatedEmployee : emp)
            );
          }
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
