
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AttendanceUploader } from "@/components/employees/AttendanceUploader";

interface PageHeaderProps {
  employeeCount: number;
  onAddEmployee: () => void;
  onUploadData: () => void;
}

const PageHeader = ({ employeeCount, onAddEmployee, onUploadData }: PageHeaderProps) => {
  // Count departments - fixed number
  const totalDepartments = 5;

  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Employee Directory</h2>
        <p className="text-muted-foreground">
          Total {employeeCount} employees across {totalDepartments} departments
        </p>
      </div>
      <div className="flex gap-3">
        <AttendanceUploader onFileUploaded={() => {}} />
        <Button onClick={onAddEmployee}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
