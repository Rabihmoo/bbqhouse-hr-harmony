
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

interface PageHeaderProps {
  employeeCount: number;
  onAddEmployee: () => void;
  onUploadData: () => void;
}

const PageHeader = ({ employeeCount, onAddEmployee, onUploadData }: PageHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Employee Directory</h2>
        <p className="text-muted-foreground">
          Total {employeeCount} employees across 5 departments
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onUploadData}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Attendance Data
        </Button>
        <Button onClick={onAddEmployee}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
