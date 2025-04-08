
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttendanceReport } from "@/utils/attendance/types";

interface FilterSectionProps {
  reportData: AttendanceReport;
  selectedDepartments: string[];
  setSelectedDepartments: (departments: string[]) => void;
  selectedBranches: string[];
  setSelectedBranches: (branches: string[]) => void;
  selectedStatus: 'active' | 'all';
  setSelectedStatus: (status: 'active' | 'all') => void;
  selectedEmployees: string[];
  setSelectedEmployees: (employees: string[]) => void;
}

export function FilterSection({
  reportData,
  selectedDepartments,
  setSelectedDepartments,
  selectedBranches,
  setSelectedBranches,
  selectedStatus,
  setSelectedStatus,
  selectedEmployees,
  setSelectedEmployees
}: FilterSectionProps) {
  // Extract unique departments and branches from employee data
  const departments = [...new Set(reportData.employeeReports.map(emp => emp.department))];
  const branches = ["Main Branch", "Branch 1", "Branch 2"]; // This would ideally come from your data

  // Create employee options for multi-select
  const employeeOptions = reportData.employeeReports.map(emp => ({
    value: emp.employeeId,
    label: emp.employeeName
  }));

  // Convert arrays to proper options format for MultiSelect
  const departmentOptions = departments.map(dept => ({
    value: dept,
    label: dept
  }));

  const branchOptions = branches.map(branch => ({
    value: branch,
    label: branch
  }));
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Department</Label>
        <MultiSelect
          options={departmentOptions}
          selected={selectedDepartments}
          onChange={setSelectedDepartments}
          placeholder="All Departments"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Branch</Label>
        <MultiSelect
          options={branchOptions}
          selected={selectedBranches}
          onChange={setSelectedBranches}
          placeholder="All Branches"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={selectedStatus}
          onValueChange={(value: 'active' | 'all') => setSelectedStatus(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="all">All Employees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Specific Employees</Label>
        <MultiSelect
          options={employeeOptions}
          selected={selectedEmployees}
          onChange={setSelectedEmployees}
          placeholder="All Employees"
          className="w-full"
        />
      </div>
    </div>
  );
}
