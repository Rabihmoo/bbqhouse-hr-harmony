
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { companies } from "@/lib/data";

interface PageHeaderProps {
  employeeCount: number;
  onAddEmployee: () => void;
  onUploadData: () => void;
  selectedCompany: string | null;
  onCompanyChange: (company: string | null) => void;
}

const PageHeader = ({ 
  employeeCount, 
  onAddEmployee, 
  onUploadData,
  selectedCompany,
  onCompanyChange
}: PageHeaderProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Employee Management</h2>
            <p className="text-muted-foreground">
              {employeeCount} total employees
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-64">
              <Label htmlFor="company-filter" className="mb-1">Filter by Company</Label>
              <Select
                value={selectedCompany || ""}
                onValueChange={(value) => onCompanyChange(value === "" ? null : value)}
              >
                <SelectTrigger id="company-filter">
                  <SelectValue placeholder="All companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All companies</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.name}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={onAddEmployee}
                className="w-full sm:w-auto"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Add Employee</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onUploadData}
                className="w-full sm:w-auto"
              >
                <Upload className="mr-2 h-4 w-4" />
                <span>Upload Attendance</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageHeader;
