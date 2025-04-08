
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { AttendanceReport } from "@/utils/attendance/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue
} from "@/components/ui/multi-select";
import { FileDown, Mail } from "lucide-react";
import { ExportOptions } from "@/hooks/use-attendance-uploader";

interface ExportSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: AttendanceReport | null;
  onExport: (options: ExportOptions) => void;
}

export function ExportSettingsDialog({
  open,
  onOpenChange,
  reportData,
  onExport
}: ExportSettingsDialogProps) {
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'both'>('excel');
  const [includeSignature, setIncludeSignature] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'all'>('active');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  if (!reportData) return null;

  // Extract unique departments and branches from employee data
  const departments = [...new Set(reportData.employeeReports.map(emp => emp.department))];
  const branches = ["Main Branch", "Branch 1", "Branch 2"]; // This would ideally come from your data

  // Create employee options for multi-select
  const employeeOptions = reportData.employeeReports.map(emp => ({
    value: emp.employeeId,
    label: emp.employeeName
  }));

  const handleExport = () => {
    onExport({
      format: exportFormat,
      includeSignature,
      sendEmail,
      emailAddress: sendEmail ? emailAddress : undefined,
      filters: {
        department: selectedDepartments.length > 0 ? selectedDepartments.join(",") : undefined,
        branch: selectedBranches.length > 0 ? selectedBranches.join(",") : undefined,
        status: selectedStatus,
        employees: selectedEmployees.length > 0 ? selectedEmployees : undefined
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Settings</DialogTitle>
          <DialogDescription>
            Configure how you want to export employee declarations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: 'excel' | 'pdf' | 'both') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel Only</SelectItem>
                <SelectItem value="pdf">PDF Only</SelectItem>
                <SelectItem value="both">Both Excel & PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeSignature"
              checked={includeSignature}
              onCheckedChange={(checked) => setIncludeSignature(!!checked)}
            />
            <Label htmlFor="includeSignature">Include signature image (if available)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendEmail"
              checked={sendEmail}
              onCheckedChange={(checked) => setSendEmail(!!checked)}
            />
            <Label htmlFor="sendEmail">Send via email</Label>
          </div>

          {sendEmail && (
            <div className="space-y-2 pl-6">
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="Enter email address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="filters">
              <AccordionTrigger>Advanced Filters</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <MultiSelect
                      values={selectedDepartments}
                      onValuesChange={setSelectedDepartments}
                      placeholder="All Departments"
                    >
                      <MultiSelectTrigger />
                      <MultiSelectContent>
                        {departments.map((dept) => (
                          <MultiSelectItem key={dept} value={dept}>{dept}</MultiSelectItem>
                        ))}
                      </MultiSelectContent>
                    </MultiSelect>
                  </div>

                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <MultiSelect
                      values={selectedBranches}
                      onValuesChange={setSelectedBranches}
                      placeholder="All Branches"
                    >
                      <MultiSelectTrigger />
                      <MultiSelectContent>
                        {branches.map((branch) => (
                          <MultiSelectItem key={branch} value={branch}>{branch}</MultiSelectItem>
                        ))}
                      </MultiSelectContent>
                    </MultiSelect>
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
                      values={selectedEmployees}
                      onValuesChange={setSelectedEmployees}
                      placeholder="All Employees"
                    >
                      <MultiSelectTrigger />
                      <MultiSelectContent>
                        {employeeOptions.map((emp) => (
                          <MultiSelectItem key={emp.value} value={emp.value}>{emp.label}</MultiSelectItem>
                        ))}
                      </MultiSelectContent>
                    </MultiSelect>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2">
            {sendEmail ? <Mail className="h-4 w-4" /> : <FileDown className="h-4 w-4" />}
            Export Declarations
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
