
import { useState, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { 
  departmentColors, 
  employees as employeesData, 
  statusColors 
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Upload } from "lucide-react";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { useToast } from "@/hooks/use-toast";
import { format, isValid, parseISO } from "date-fns";

const Employees = () => {
  const [employees, setEmployees] = useState(employeesData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would process the CSV/Excel file
      // For now, we'll just show a toast that it's being processed
      toast({
        title: "Attendance data received",
        description: "Your file is being processed. You'll be notified when it's complete.",
      });
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Simulate processing completion after 2 seconds
      setTimeout(() => {
        toast({
          title: "Attendance data processed",
          description: "Your attendance data has been successfully imported.",
        });
      }, 2000);
    }
  };

  // Function to safely format dates or show a placeholder
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not set";
    
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      if (!isValid(date)) return "Invalid date";
      return format(date, "dd/MM/yyyy");
    } catch (e) {
      return "Invalid date";
    }
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
        <div className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls"
            className="hidden"
          />
          <Button variant="outline" onClick={handleFileUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Attendance Data
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
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
              key: "inssNumber",
              header: "INSS Number",
              render: (row) => (
                <span>{row.inssNumber || "Not set"}</span>
              ),
            },
            {
              key: "biNumber",
              header: "BI Number",
            },
            {
              key: "biValidUntil",
              header: "BI Validity",
              render: (row) => (
                <span className={cn(
                  row.biValid ? "text-green-600" : "text-red-600"
                )}>
                  {formatDate(row.biValidUntil)}
                </span>
              ),
            },
            {
              key: "healthCardValidUntil",
              header: "Health Card",
              render: (row) => (
                <span className={cn(
                  row.healthCardValid ? "text-green-600" : "text-red-600"
                )}>
                  {formatDate(row.healthCardValidUntil)}
                </span>
              ),
            },
            {
              key: "hireDate",
              header: "Hire Date",
              render: (row) => (
                <span>{formatDate(row.hireDate)}</span>
              ),
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
              header: "Leaves",
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
