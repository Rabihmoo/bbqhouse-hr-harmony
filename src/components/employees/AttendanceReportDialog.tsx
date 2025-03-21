
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AttendanceReport } from "@/utils/attendanceProcessor";
import { useToast } from "@/hooks/use-toast";

interface AttendanceReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: AttendanceReport | null;
}

const AttendanceReportDialog = ({ open, onOpenChange, reportData }: AttendanceReportDialogProps) => {
  const { toast } = useToast();

  if (!reportData) {
    return null;
  }

  const handleExportClick = () => {
    toast({
      title: "Report exported",
      description: "The attendance report has been exported to Excel format.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Attendance Report</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold">Attendance Summary Report</h3>
            <p className="text-sm text-muted-foreground">
              Generated on {new Date(reportData.reportDate).toLocaleDateString()}
            </p>
          </div>
          
          {reportData.employeeReports.map((report) => (
            <div key={report.employeeId} className="border rounded-lg p-4 space-y-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h4 className="font-semibold">{report.employeeName}</h4>
                  <p className="text-sm text-muted-foreground">BI: {report.biNumber}</p>
                  <p className="text-sm text-muted-foreground">Department: {report.department}</p>
                </div>
                <div className="mt-2 md:mt-0 space-y-1">
                  <p><span className="font-medium">Working Days:</span> {report.workingDays}</p>
                  <p><span className="font-medium">Total Hours:</span> {report.totalHours}h</p>
                  <p><span className="font-medium">Extra Hours:</span> {report.extraHours}h</p>
                </div>
              </div>
              
              <AttendanceRecordsTable records={report.attendanceRecords} />
            </div>
          ))}
          
          <div className="text-center pt-4">
            <Button onClick={handleExportClick}>
              Export to Excel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface AttendanceRecordsTableProps {
  records: { date: string; clockIn: string; clockOut: string; workTime: string }[];
}

const AttendanceRecordsTable = ({ records }: AttendanceRecordsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3">Date</th>
            <th className="text-left py-2 px-3">Clock In</th>
            <th className="text-left py-2 px-3">Clock Out</th>
            <th className="text-left py-2 px-3">Work Time</th>
          </tr>
        </thead>
        <tbody>
          {records.slice(0, 5).map((record, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-3">{record.date}</td>
              <td className="py-2 px-3">{record.clockIn}</td>
              <td className="py-2 px-3">{record.clockOut}</td>
              <td className="py-2 px-3">{record.workTime}</td>
            </tr>
          ))}
          {records.length > 5 && (
            <tr>
              <td colSpan={4} className="py-2 px-3 text-center">
                <Button variant="link" size="sm">
                  View all {records.length} records
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceReportDialog;
