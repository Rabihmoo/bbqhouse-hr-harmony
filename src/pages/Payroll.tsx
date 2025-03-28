
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { departmentColors } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useEmployeeData } from "@/hooks/use-employee-data";

const Payroll = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  
  // Get only active employees using the hook
  const { employees: activeEmployees } = useEmployeeData(true);
  
  // Filter active employees by company if selected
  const filteredEmployees = selectedCompany 
    ? activeEmployees.filter(emp => emp.company === selectedCompany)
    : activeEmployees;

  // Create payroll data based on filtered employees
  const payrollData = filteredEmployees.map(employee => ({
    id: employee.id,
    employeeId: employee.id,
    employeeName: employee.fullName,
    department: employee.department,
    position: employee.position,
    company: employee.company,
    basicSalary: employee.salaryStructure?.basicSalary || 0,
    transportAllowance: employee.salaryStructure?.transportAllowance || 0,
    accommodationAllowance: employee.salaryStructure?.accommodationAllowance || 0,
    bonus: employee.salaryStructure?.bonus || 0,
    netSalary: employee.salaryStructure?.totalSalary || employee.salary || 0,
    paymentStatus: "Pending"
  }));

  // Get unique companies from active employees
  const companies = [...new Set(activeEmployees.map(emp => emp.company))];

  return (
    <DashboardLayout title="Payroll" subtitle="Manage employee salaries and payments">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payroll Management</h2>
          <p className="text-muted-foreground">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Payroll
          </p>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="w-72">
            <Select
              value={selectedCompany || "all"}
              onValueChange={(value) => setSelectedCompany(value === "all" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline">Export</Button>
        </div>
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
              key: "company",
              header: "Company",
              render: (row) => (
                <span className="font-medium">{row.company}</span>
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
              key: "basicSalary",
              header: "Basic",
              render: (row) => (
                <span>{row.basicSalary.toLocaleString()} KZ</span>
              ),
            },
            {
              key: "transportAllowance",
              header: "Transport",
              render: (row) => (
                <span>{row.transportAllowance.toLocaleString()} KZ</span>
              ),
            },
            {
              key: "accommodationAllowance",
              header: "Accom.",
              render: (row) => (
                <span>{row.accommodationAllowance.toLocaleString()} KZ</span>
              ),
            },
            {
              key: "bonus",
              header: "Bonus",
              render: (row) => (
                <span>{row.bonus.toLocaleString()} KZ</span>
              ),
            },
            {
              key: "netSalary",
              header: "Total",
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
