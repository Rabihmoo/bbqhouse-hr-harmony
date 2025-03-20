
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { 
  departmentColors, 
  employees as employeesData, 
  statusColors 
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { useToast } from "@/hooks/use-toast";

const Employees = () => {
  const [employees, setEmployees] = useState(employeesData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const { toast } = useToast();

  const handleAddEmployee = (data: any) => {
    const newEmployee = {
      ...data,
      id: String(employees.length + 1),
      status: 'Active',
      remainingLeaves: 30,
    };
    
    setEmployees([...employees, newEmployee]);
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
    toast({
      title: "Employee updated",
      description: `${data.fullName}'s information has been updated.`,
    });
  };

  const handleRowClick = (employee: any) => {
    setEditingEmployee(employee);
  };

  return (
    <DashboardLayout title="Employees" subtitle="Manage employee records">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Employee Directory</h2>
          <p className="text-muted-foreground">
            Total {employees.length} employees across 5 departments
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden">
        <DataTable
          data={employees}
          columns={[
            {
              key: "fullName",
              header: "Employee Name",
            },
            {
              key: "position",
              header: "Position",
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
              header: "Hire Date",
            },
            {
              key: "salary",
              header: "Salary",
              render: (row) => (
                <span>{row.salary.toLocaleString()} KZ</span>
              ),
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
              key: "remainingLeaves",
              header: "Leaves Remaining",
              render: (row) => (
                <span className="font-medium">{row.remainingLeaves} days</span>
              ),
            },
          ]}
          onRowClick={handleRowClick}
        />
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
