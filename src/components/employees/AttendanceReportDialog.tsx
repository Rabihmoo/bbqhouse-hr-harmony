
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AttendanceReport } from "@/utils/attendanceProcessor";
import { useState } from "react";
import { FileText } from "lucide-react";
import { ReportControls } from "./attendance-report/ReportControls";
import { AttendanceReportTabs } from "./attendance-report/AttendanceReportTabs";

interface AttendanceReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: AttendanceReport | null;
}

const AttendanceReportDialog = ({ open, onOpenChange, reportData }: AttendanceReportDialogProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("MYR HR Management");
  const [month, setMonth] = useState<string>(reportData?.month || "");
  const [year, setYear] = useState<string>(reportData?.year || new Date().getFullYear().toString());
  const [currentView, setCurrentView] = useState<"summary" | "individual">("summary");

  if (!reportData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Attendance Report & Declarations
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <ReportControls
            companyName={companyName}
            setCompanyName={setCompanyName}
            month={month}
            setMonth={setMonth}
            year={year}
            setYear={setYear}
          />
          
          <AttendanceReportTabs
            currentView={currentView}
            setCurrentView={setCurrentView}
            reportData={reportData}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            companyName={companyName}
            month={month}
            year={year}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceReportDialog;
