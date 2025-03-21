import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { employees as initialEmployeesData, calculateLeaveAllowance, getEmployeeYearsOfService } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import EmployeeForm from "@/components/employees/EmployeeForm";
import EmployeesList from "@/components/employees/EmployeesList";
import PageHeader from "@/components/employees/PageHeader";
import AttendanceUploader from "@/components/employees/AttendanceUploader";
import { format, addYears, differenceInYears, parseISO, isBefore } from "date-fns";
import { LeaveAllowance, LeaveRecord, Notification } from "@/types/notification";

const LOCAL_STORAGE_KEY = 'restaurant-employees-data';

const Employees = () => {
  // Load initial data from localStorage if available, otherwise use the default data
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedEmployees ? JSON.parse(savedEmployees) : initialEmployeesData;
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const attendanceUploaderRef = useRef<HTMLDivElement>(null);

  // Save to localStorage whenever employees data changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  // Calculate and update leave allowances for all employees
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    const updatedEmployees = employees.map(employee => {
      if (!employee.hireDate) return employee;
      
      const hireDate = parseISO(employee.hireDate);
      const yearsEmployed = getEmployeeYearsOfService(employee.hireDate);
      
      // Skip if less than a year employed
      if (yearsEmployed < 1) return employee;
      
      // Initialize arrays if they don't exist
      const leaveAllowances = employee.leaveAllowances || [];
      const leaveRecords = employee.leaveRecords || [];
      
      // Check each employment year starting from hire year
      const updatedAllowances: LeaveAllowance[] = [];
      
      for (let year = hireDate.getFullYear() + 1; year <= currentYear; year++) {
        // Check if we already have an allowance record for this year
        const existingAllowance = leaveAllowances.find(a => a.year === year);
        
        if (existingAllowance) {
          // Update existing allowance with current records
          const recordsForYear = leaveRecords.filter(r => r.year === year && r.type === 'annual');
          const daysTaken = recordsForYear.reduce((sum, record) => sum + record.days, 0);
          
          const yearsAtStartOfYear = year - hireDate.getFullYear();
          const daysEntitled = calculateLeaveAllowance(yearsAtStartOfYear);
          const remaining = daysEntitled - daysTaken;
          
          updatedAllowances.push({
            ...existingAllowance,
            daysEntitled,
            daysTaken,
            remaining,
            status: daysTaken === 0 ? 'unused' : 
                   daysTaken < daysEntitled ? 'partially-used' : 'fully-used'
          });
        } else {
          // Create new allowance record
          const yearsAtStartOfYear = year - hireDate.getFullYear();
          const daysEntitled = calculateLeaveAllowance(yearsAtStartOfYear);
          
          // Check if there are any leave records for this year
          const recordsForYear = leaveRecords.filter(r => r.year === year && r.type === 'annual');
          const daysTaken = recordsForYear.reduce((sum, record) => sum + record.days, 0);
          const remaining = daysEntitled - daysTaken;
          
          updatedAllowances.push({
            year,
            daysEntitled,
            daysTaken,
            remaining,
            status: daysTaken === 0 ? 'unused' : 
                   daysTaken < daysEntitled ? 'partially-used' : 'fully-used'
          });
        }
      }
      
      return {
        ...employee,
        leaveAllowances: updatedAllowances,
        leaveRecords: leaveRecords
      };
    });
    
    setEmployees(updatedEmployees);
  }, []);

  // Check for various employee notifications
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const newNotifications: Notification[] = [];
    
    employees.forEach(employee => {
      const employeeId = employee.id;
      const employeeName = employee.fullName;
      
      // Check for annual leave eligibility and unused leave
      if (employee.hireDate) {
        const hireDate = parseISO(employee.hireDate);
        const yearsEmployed = differenceInYears(today, hireDate);
        
        // Annual leave eligibility notification (if 1+ year employed and 0 leave days)
        if (yearsEmployed >= 1 && employee.remainingLeaves === 0) {
          newNotifications.push({
            id: `leave-${employeeId}`,
            type: 'info',
            title: 'Annual Leave Eligible',
            message: `${employeeName} is eligible for annual leave.`,
            employeeId: employeeId,
            timestamp: new Date().toISOString(),
            actionType: 'view-employee'
          });
        }
        
        // Check for unused leave allowances
        if (employee.leaveAllowances && employee.leaveAllowances.length > 0) {
          employee.leaveAllowances.forEach(allowance => {
            if (allowance.status === 'unused') {
              newNotifications.push({
                id: `unused-leave-${employeeId}-${allowance.year}`,
                type: 'warning',
                title: 'Unused Annual Leave',
                message: `${employeeName} has not taken any of their ${allowance.daysEntitled} days of leave for ${allowance.year}.`,
                employeeId: employeeId,
                timestamp: new Date().toISOString(),
                actionType: 'view-employee'
              });
            } else if (allowance.status === 'partially-used' && allowance.year < currentYear) {
              newNotifications.push({
                id: `partial-leave-${employeeId}-${allowance.year}`,
                type: 'info',
                title: 'Partially Used Leave',
                message: `${employeeName} has ${allowance.remaining} remaining days of leave from ${allowance.year}.`,
                employeeId: employeeId,
                timestamp: new Date().toISOString(),
                actionType: 'view-employee'
              });
            }
          });
        }
        
        // Work anniversary notification
        const isAnniversaryToday = 
          today.getDate() === hireDate.getDate() && 
          today.getMonth() === hireDate.getMonth();
        
        if (isAnniversaryToday && yearsEmployed > 0) {
          newNotifications.push({
            id: `anniversary-${employeeId}`,
            type: 'success',
            title: 'Work Anniversary',
            message: `Today marks ${yearsEmployed} year${yearsEmployed > 1 ? 's' : ''} since ${employeeName} joined.`,
            employeeId: employeeId,
            timestamp: new Date().toISOString(),
            actionType: 'view-employee'
          });
        }
      }
      
      // Check for expired BI
      if (employee.biValidUntil) {
        const biExpiryDate = parseISO(employee.biValidUntil);
        if (isBefore(biExpiryDate, today) || !employee.biValid) {
          newNotifications.push({
            id: `bi-${employeeId}`,
            type: 'warning',
            title: 'BI Expired',
            message: `${employeeName}'s BI has expired or is invalid.`,
            employeeId: employeeId,
            timestamp: new Date().toISOString(),
          });
        }
      }
      
      // Check for expired Health Card
      if (employee.healthCardValidUntil) {
        const healthCardExpiryDate = parseISO(employee.healthCardValidUntil);
        if (isBefore(healthCardExpiryDate, today) || !employee.healthCardValid) {
          newNotifications.push({
            id: `health-${employeeId}`,
            type: 'warning',
            title: 'Health Card Expired',
            message: `${employeeName}'s Health Card has expired or is invalid.`,
            employeeId: employeeId,
            timestamp: new Date().toISOString(),
          });
        }
      }
      
      // Check for missing required information
      const missingFields = [];
      if (!employee.biNumber) missingFields.push('BI Number');
      if (!employee.inssNumber) missingFields.push('INSS Number');
      if (!employee.phone) missingFields.push('Phone');
      if (!employee.address) missingFields.push('Address');
      if (!employee.position) missingFields.push('Position');
      if (!employee.department) missingFields.push('Department');
      if (!employee.salary) missingFields.push('Salary');
      if (!employee.picture) missingFields.push('Profile Picture');
      
      if (missingFields.length > 0) {
        newNotifications.push({
          id: `missing-${employeeId}`,
          type: 'error',
          title: 'Missing Information',
          message: `${employeeName} is missing: ${missingFields.join(', ')}`,
          employeeId: employeeId,
          timestamp: new Date().toISOString(),
        });
      }
    });
    
    setNotifications(newNotifications);
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

  // Handle notification click to open the employee edit form
  const handleNotificationClick = (notification: Notification) => {
    if (notification.employeeId) {
      const employee = employees.find(emp => emp.id === notification.employeeId);
      if (employee) {
        setEditingEmployee(employee);
      }
    }
  };

  // Handle adding a leave record to an employee
  const handleAddLeaveRecord = (employeeId: string, leaveRecord: Omit<LeaveRecord, 'id'>) => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === employeeId) {
        const leaveRecords = emp.leaveRecords || [];
        const newRecord = {
          ...leaveRecord,
          id: `leave-${Date.now()}`
        };
        
        return {
          ...emp,
          leaveRecords: [...leaveRecords, newRecord]
        };
      }
      return emp;
    });
    
    setEmployees(updatedEmployees);
    toast({
      title: "Leave record added",
      description: `Leave record has been added successfully.`,
    });
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
