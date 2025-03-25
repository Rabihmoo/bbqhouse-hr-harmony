
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import { departmentColors, statusColors, getEmployeeYearsOfService } from "@/lib/data";
import { format, isValid, parseISO } from "date-fns";
import { LeaveAllowance } from "@/types/notification";
import { FileCheck, FileX } from "lucide-react";

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

  // Function to display leave information
  const formatLeaveInfo = (employee: any) => {
    if (!employee.hireDate) return "N/A";
    
    const yearsEmployed = getEmployeeYearsOfService(employee.hireDate);
    if (yearsEmployed < 1) return "Not eligible yet";
    
    const currentYear = new Date().getFullYear();
    const currentYearAllowance = employee.leaveAllowances?.find((a: LeaveAllowance) => a.year === currentYear);
    
    if (!currentYearAllowance) {
      return `${employee.remainingLeaves || 0} days`;
    }
    
    return `${currentYearAllowance.remaining}/${currentYearAllowance.daysEntitled} days`;
  };

  // Function to display leave status with color coding and by year
  const formatLeaveStatus = (employee: any) => {
    if (!employee.hireDate) return null;
    
    const yearsEmployed = getEmployeeYearsOfService(employee.hireDate);
    if (yearsEmployed < 1) return (
      <span className="text-gray-500">Not eligible</span>
    );
    
    // Get all allowances and sort them by year (oldest first)
    const allowances = employee.leaveAllowances?.sort((a: LeaveAllowance, b: LeaveAllowance) => a.year - b.year) || [];
    
    if (allowances.length === 0) {
      return <span className="text-gray-500">No leave data</span>;
    }
    
    return (
      <div className="flex flex-col gap-1">
        {allowances.map((allowance: LeaveAllowance) => (
          <div key={allowance.year} className="flex items-center gap-1">
            <span className={cn(
              "w-2 h-2 rounded-full",
              allowance.status === 'unused' ? "bg-red-500" : 
              allowance.status === 'partially-used' ? "bg-amber-500" : "bg-green-500"
            )}></span>
            <span className="text-xs">{allowance.year}: {allowance.remaining}/{allowance.daysEntitled}</span>
          </div>
        ))}
      </div>
    );
  };

  // Function to display document status
  const formatDocumentStatus = (employee: any) => {
    if (!employee.documents) return null;

    const requiredDocs = ['bi', 'healthCard', 'tax', 'nuit', 'declaration', 'cv'];
    const uploadedDocs = requiredDocs.filter(doc => 
      employee.documents[doc] && employee.documents[doc].uploaded
    );
    
    const allUploaded = uploadedDocs.length === requiredDocs.length;
    
    return (
      <div className="flex items-center gap-2">
        {allUploaded ? (
          <>
            <FileCheck className="text-green-500 h-4 w-4" />
            <span className="text-green-600 text-xs">Complete</span>
          </>
        ) : (
          <>
            <FileX className="text-amber-500 h-4 w-4" />
            <span className="text-amber-600 text-xs">{uploadedDocs.length}/{requiredDocs.length}</span>
          </>
        )}
      </div>
    );
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
            key: "company",
            header: "Company",
            render: (row) => (
              <span>{row.company || "Not assigned"}</span>
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
            key: "hireDate",
            header: "Hire Date",
            render: (row) => (
              <span>{formatDate(row.hireDate)}</span>
            ),
          },
          {
            key: "documents",
            header: "Documents",
            render: (row) => formatDocumentStatus(row),
          },
          {
            key: "salary",
            header: "Salary",
            render: (row) => (
              <span>{row.salary?.toLocaleString() || '0'} KZ</span>
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
            key: "leaveInfo",
            header: "Annual Leave",
            render: (row) => (
              <div className="font-medium">
                {formatLeaveStatus(row)}
              </div>
            ),
          },
        ]}
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default EmployeesList;
