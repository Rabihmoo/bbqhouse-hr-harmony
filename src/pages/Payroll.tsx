
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { employees, departmentColors } from "@/lib/data";
import { cn } from "@/lib/utils";

const Payroll = () => {
  // Create payroll data based on employees
  const payrollData = employees.map(employee => ({
    id: employee.id,
    employeeId: employee.id,
    employeeName: employee.fullName,
    department: employee.department,
    position: employee.position,
    baseSalary: employee.salary,
    deductions: 0,
    bonus: 0,
    netSalary: employee.salary,
    paymentStatus: "Pending"
  }));

  return (
    <DashboardLayout title="Payroll" subtitle="Manage employee salaries and payments">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Payroll Management</h2>
        <p className="text-muted-foreground">
          {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Payroll
        </p>
      </div>

      <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden">
        <DataTable
          data={payrollData}
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
              key: "position",
              header: "Position",
            },
            {
              key: "baseSalary",
              header: "Base Salary",
              render: (row) => (
                <span>{row.baseSalary.toLocaleString()} KZ</span>
              ),
            },
            {
              key: "deductions",
              header: "Deductions",
              render: (row) => (
                <span>{row.deductions.toLocaleString()} KZ</span>
              ),
            },
            {
              key: "netSalary",
              header: "Net Salary",
              render: (row) => (
                <span className="font-medium">{row.netSalary.toLocaleString()} KZ</span>
              ),
            },
            {
              key: "paymentStatus",
              header: "Status",
              render: (row) => (
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs text-white",
                  row.paymentStatus === "Paid" ? "bg-green-500" : "bg-amber-500"
                )}>
                  {row.paymentStatus}
                </span>
              ),
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
};

export default Payroll;
