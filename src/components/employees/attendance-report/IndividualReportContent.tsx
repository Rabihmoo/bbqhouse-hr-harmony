
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AttendanceReport } from "@/utils/attendanceProcessor";
import { DeclarationText } from "./DeclarationText";

interface IndividualReportContentProps {
  reportData: AttendanceReport;
  selectedEmployee: string;
  setSelectedEmployee: (value: string) => void;
  companyName: string;
  month: string;
  year: string;
}

export function IndividualReportContent({
  reportData,
  selectedEmployee,
  setSelectedEmployee,
  companyName,
  month,
  year
}: IndividualReportContentProps) {
  const { toast } = useToast();

  const handlePrintDeclaration = () => {
    toast({
      title: "Printing declaration",
      description: "The individual declaration is being sent to the printer.",
    });
  };

  const handleExportIndividual = () => {
    toast({
      title: "Declaration exported",
      description: "The individual declaration has been exported as PDF.",
    });
  };

  // Get the selected employee report
  const selectedEmployeeReport = reportData.employeeReports.find(
    report => report.employeeId === selectedEmployee
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Label htmlFor="employee-select">Select Employee</Label>
        <Select
          value={selectedEmployee}
          onValueChange={setSelectedEmployee}
        >
          <SelectTrigger id="employee-select">
            <SelectValue placeholder="Select an employee" />
          </SelectTrigger>
          <SelectContent>
            {reportData.employeeReports.map(report => (
              <SelectItem key={report.employeeId} value={report.employeeId}>
                {report.employeeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedEmployeeReport && (
        <>
          <DeclarationText
            employeeName={selectedEmployeeReport.employeeName}
            biNumber={selectedEmployeeReport.biNumber}
            companyName={companyName}
            month={month}
            year={year}
            attendanceRecords={selectedEmployeeReport.attendanceRecords}
            totalHours={selectedEmployeeReport.totalHours}
            extraHours={selectedEmployeeReport.extraHours}
            workingDays={selectedEmployeeReport.workingDays}
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handlePrintDeclaration}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleExportIndividual}>
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
