
import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import { departmentColors, getEmployeeYearsOfService } from "@/lib/data";
import { format, isValid, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { LeaveAllowance } from "@/types/notification";
import LeaveRequestForm from "./LeaveRequestForm";

interface MissingLeavesListProps {
  employees: any[];
  onAddLeave: (employeeId: string, leaveData: any) => void;
  highlightEmployeeId?: string | null;
}

const MissingLeavesList = ({ 
  employees, 
  onAddLeave,
  highlightEmployeeId 
}: MissingLeavesListProps) => {
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  
  // Get employees with missing leave records
  const employeesWithMissingLeaves = employees.filter(employee => {
    // Skip if no hire date
    if (!employee.hireDate) return false;
    
    const yearsEmployed = getEmployeeYearsOfService(employee.hireDate);
    if (yearsEmployed < 1) return false;
    
    // Check if they have any unused or partially used leave allowances
    const hasUnusedLeaves = employee.leaveAllowances?.some(
      (allowance: LeaveAllowance) => 
        allowance.status === 'unused' || 
        allowance.status === 'partially-used'
    );
    
    return hasUnusedLeaves;
  });

  // If there's a highlighted employee ID, select that employee
  useEffect(() => {
    if (highlightEmployeeId) {
      const employee = employees.find(emp => emp.id === highlightEmployeeId);
      if (employee) {
        // Scroll to that employee or highlight them
        setTimeout(() => {
          const element = document.getElementById(`employee-row-${highlightEmployeeId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('bg-primary/10');
            setTimeout(() => {
              element.classList.remove('bg-primary/10');
            }, 2000);
          }
        }, 500);
      }
    }
  }, [highlightEmployeeId, employees]);

  const handleAddLeaveClick = (employee: any) => {
    setSelectedEmployee(employee);
    setShowLeaveForm(true);
  };

  const handleSubmitLeave = (leaveData: any) => {
    onAddLeave(selectedEmployee.id, leaveData);
    setShowLeaveForm(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Employees with Unused Annual Leave</h2>
      
      {employeesWithMissingLeaves.length === 0 ? (
        <div className="bg-white dark:bg-black/40 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">All employees have used their annual leave entitlements.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden">
          <DataTable
            data={employeesWithMissingLeaves}
            columns={[
              {
                key: "fullName",
                header: "Employee Name",
                render: (row) => (
                  <div id={`employee-row-${row.id}`} className={cn(
                    "py-1",
                    highlightEmployeeId === row.id ? "bg-primary/5" : ""
                  )}>
                    {row.fullName}
                  </div>
                ),
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
                key: "hireDate",
                header: "Hired On",
                render: (row) => (
                  <span>
                    {format(parseISO(row.hireDate), "dd/MM/yyyy")}
                    <span className="text-xs text-muted-foreground ml-2">
                      ({getEmployeeYearsOfService(row.hireDate)} years)
                    </span>
                  </span>
                ),
              },
              {
                key: "missingLeaves",
                header: "Unused Leave Periods",
                render: (row) => (
                  <div className="space-y-1">
                    {row.leaveAllowances
                      ?.filter((a: LeaveAllowance) => a.status !== 'fully-used')
                      .sort((a: LeaveAllowance, b: LeaveAllowance) => a.year - b.year) // Sort by year ascending
                      .map((allowance: LeaveAllowance) => (
                        <div key={allowance.year} className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs text-white",
                            allowance.status === 'unused' ? "bg-red-500" : "bg-amber-500"
                          )}>
                            {allowance.year}
                          </span>
                          <span className="text-sm">
                            {allowance.remaining}/{allowance.daysEntitled} days remaining
                          </span>
                        </div>
                      ))}
                  </div>
                ),
              },
              {
                key: "actions",
                header: "Actions",
                render: (row) => (
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddLeaveClick(row);
                    }}
                  >
                    Add Leave Record
                  </Button>
                ),
              },
            ]}
          />
        </div>
      )}
      
      {selectedEmployee && (
        <LeaveRequestForm
          open={showLeaveForm}
          onClose={() => {
            setShowLeaveForm(false);
            setSelectedEmployee(null);
          }}
          onSubmit={handleSubmitLeave}
          initialEmployeeId={selectedEmployee.id}
        />
      )}
    </div>
  );
};

export default MissingLeavesList;
