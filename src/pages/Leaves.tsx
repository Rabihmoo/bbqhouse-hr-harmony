
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { leaveRequests as leaveRequestsData, departmentColors, statusColors, employees as initialEmployeesData, getEmployeeYearsOfService, calculateLeaveAllowance } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LeaveRequest, LeaveStatus } from "@/lib/data";
import MissingLeavesList from "@/components/leaves/MissingLeavesList";
import LeaveRecordsList from "@/components/leaves/LeaveRecordsList";
import LeaveRequestForm from "@/components/leaves/LeaveRequestForm";

const LOCAL_STORAGE_KEY = 'restaurant-employees-data';

const Leaves = () => {
  const [leaveRequests, setLeaveRequests] = useState(leaveRequestsData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLeaveRequest, setEditingLeaveRequest] = useState<LeaveRequest | null>(null);
  const { toast } = useToast();
  
  // Load employees data from localStorage
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedEmployees ? JSON.parse(savedEmployees) : initialEmployeesData;
  });
  
  // Refresh employee data when localStorage changes
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

  // Gather all leave records from all employees
  const allLeaveRecords = employees.reduce((records: any[], employee: any) => {
    if (employee.leaveRecords && employee.leaveRecords.length > 0) {
      const employeeRecords = employee.leaveRecords.map((record: any) => ({
        ...record,
        employeeName: employee.fullName,
        employeeId: employee.id
      }));
      return [...records, ...employeeRecords];
    }
    return records;
  }, []);

  const handleAddLeaveRequest = (data: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => {
    const newLeaveRequest: LeaveRequest = {
      ...data,
      id: String(leaveRequests.length + 1),
      status: 'Pending' as LeaveStatus,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setLeaveRequests([...leaveRequests, newLeaveRequest]);
    toast({
      title: "Leave request added",
      description: `Leave request has been successfully submitted.`,
    });
  };

  const handleUpdateStatus = (id: string, newStatus: LeaveStatus) => {
    const updatedLeaveRequests = leaveRequests.map(request => 
      request.id === id ? { ...request, status: newStatus } : request
    );
    
    setLeaveRequests(updatedLeaveRequests);
    toast({
      title: "Status updated",
      description: `Leave request status has been updated to ${newStatus}.`,
    });
  };
  
  // Handle adding a new leave record for an employee with proper deduction
  const handleAddLeaveRecord = (employeeId: string, leaveData: any) => {
    const updatedEmployees = employees.map((emp: any) => {
      if (emp.id === employeeId) {
        const leaveRecords = emp.leaveRecords || [];
        const newRecord = {
          ...leaveData,
          id: `leave-${Date.now()}`
        };
        
        // Get the employee's leave allowances and sort by oldest year first
        const allowances = [...(emp.leaveAllowances || [])].sort((a, b) => a.year - b.year);
        
        let remainingDaysToDeduct = newRecord.days;
        
        // Only modify allowances if this is annual leave
        let updatedAllowances = allowances;
        if (newRecord.type === 'annual') {
          updatedAllowances = allowances.map(allowance => {
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
        }
        
        return {
          ...emp,
          leaveRecords: [...leaveRecords, newRecord],
          leaveAllowances: updatedAllowances
        };
      }
      return emp;
    });
    
    setEmployees(updatedEmployees);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEmployees));
    
    // Trigger a storage event for real-time updates across tabs
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Leave record added",
      description: `Leave record has been added successfully.`,
    });
  };

  return (
    <DashboardLayout title="Leave Management" subtitle="Manage employee leave requests">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Leave Requests</h2>
          <p className="text-muted-foreground">
            Total {leaveRequests.length} leave requests
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden mb-8">
        <DataTable
          data={leaveRequests}
          columns={[
            {
              key: "employeeName",
              header: "Employee",
            },
            {
              key: "department",
              header: "Department",
              render: (row) => (
                <div className="flex items-center">
                  <span className={cn("w-2 h-2 rounded-full mr-2", departmentColors[row.department])}></span>
                  {row.department}
                </div>
              ),
            },
            {
              key: "type",
              header: "Leave Type",
            },
            {
              key: "startDate",
              header: "Start Date",
            },
            {
              key: "endDate",
              header: "End Date",
            },
            {
              key: "status",
              header: "Status",
              render: (row) => (
                <span className={cn("px-2 py-1 rounded-full text-xs text-white", statusColors[row.status])}>
                  {row.status}
                </span>
              ),
            },
            {
              key: "createdAt",
              header: "Request Date",
            },
          ]}
        />
      </div>
      
      {/* Employees with missing leaves section */}
      <div className="mb-8">
        <MissingLeavesList 
          employees={employees} 
          onAddLeave={handleAddLeaveRecord} 
        />
      </div>
      
      {/* All leave records section */}
      <div>
        <LeaveRecordsList records={allLeaveRecords} />
      </div>
      
      {/* Leave request form */}
      {showAddForm && (
        <LeaveRequestForm
          open={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddLeaveRecord}
        />
      )}
    </DashboardLayout>
  );
};

export default Leaves;
