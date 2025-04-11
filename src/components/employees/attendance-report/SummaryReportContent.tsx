
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { AttendanceReport } from "@/utils/attendanceProcessor";
import { SummaryTable } from "./SummaryTable";
import { exportToExcel, getExportFileName } from "@/utils/exportOperations";

interface SummaryReportContentProps {
  reportData: AttendanceReport;
}

export function SummaryReportContent({ reportData }: SummaryReportContentProps) {
  const handleExportAll = () => {
    try {
      // Prepare data for export
      const exportData = reportData.employeeReports.map(report => ({
        'Employee': report.employeeName,
        'Company': report.company,
        'Department': report.department,
        'Working Days': report.workingDays,
        'Total Hours': report.totalHours,
        'Extra Hours': report.extraHours
      }));

      // Export combined report
      const fileName = getExportFileName(`${reportData.month}_${reportData.year}_AllDeclarations`);
      exportToExcel(exportData, fileName);

      // Export individual reports
      reportData.employeeReports.forEach(report => {
        const individualData = [{
          'Employee': report.employeeName,
          'BI Number': report.biNumber,
          'Company': report.company,
          'Department': report.department,
          'Working Days': report.workingDays,
          'Total Hours': report.totalHours,
          'Extra Hours': report.extraHours
        }];

        const individualFileName = `${report.employeeName.replace(/\s+/g, '_')}_Declaration_${reportData.month}_${reportData.year}`;
        exportToExcel(individualData, individualFileName, report.employeeId);
      });

      toast.success("All declarations exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export declarations");
    }
  };

  return (
    <div className="space-y-6">
      <SummaryTable reportData={reportData} />
      
      <div className="text-center pt-4">
        <Button onClick={handleExportAll}>
          <FileDown className="h-4 w-4 mr-2" />
          Export All Declarations
        </Button>
      </div>
    </div>
  );
}
