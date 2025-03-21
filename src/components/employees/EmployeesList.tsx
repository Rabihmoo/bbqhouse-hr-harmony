
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import { departmentColors, statusColors } from "@/lib/data";
import { format, isValid, parseISO } from "date-fns";

interface EmployeesListProps {
  employees: any[];
  onRowClick: (employee: any) => void;
}

const EmployeesList = ({ employees, onRowClick }: EmployeesListProps) => {
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
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default EmployeesList;
