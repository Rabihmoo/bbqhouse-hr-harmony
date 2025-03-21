
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { employees } from "@/lib/data";

interface AttendanceUploaderProps {
  onFileUploaded?: (reportData?: any) => void;
}

const AttendanceUploader = ({ onFileUploaded }: AttendanceUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { toast } = useToast();

  const processAttendanceData = (fileData: any) => {
    // Simulating the Python script functionality
    // In a real application, this would process the CSV/Excel file using a library
    // For now, we'll simulate this with dummy data
    
    try {
      // Here we're simulating generating reports per employee
      const employeeReports = employees.map(employee => {
        // Generate random attendance data
        const workingDays = Math.floor(Math.random() * 10) + 15; // 15-25 working days
        const totalHours = workingDays * 8 + Math.floor(Math.random() * 20); // Some extra hours
        const extraHours = Math.max(0, totalHours - (workingDays * 8));
        
        return {
          employeeId: employee.id,
          employeeName: employee.fullName,
          biNumber: employee.biNumber,
          department: employee.department,
          workingDays,
          totalHours,
          extraHours,
          attendanceRecords: Array(workingDays).fill(0).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - index);
            const clockIn = `0${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60)}`;
            const clockOut = `${17 + Math.floor(Math.random() * 3)}:${Math.floor(Math.random() * 60)}`;
            return {
              date: date.toISOString().split('T')[0],
              clockIn,
              clockOut,
              workTime: "8:00"
            };
          })
        };
      });
      
      return {
        reportDate: new Date().toISOString(),
        employeeReports
      };
    } catch (error) {
      console.error("Error processing attendance data:", error);
      throw new Error("Failed to process attendance data");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessing(true);
      
      toast({
        title: "Attendance data received",
        description: "Your file is being processed. You'll be notified when it's complete.",
      });
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Simulate processing time
      setTimeout(() => {
        try {
          const data = processAttendanceData(e.target.files![0]);
          setReportData(data);
          
          toast({
            title: "Attendance data processed",
            description: "Your attendance data has been successfully processed.",
          });
          
          setShowReportDialog(true);
          setIsProcessing(false);
          
          if (onFileUploaded) onFileUploaded(data);
        } catch (error) {
          toast({
            title: "Processing failed",
            description: "There was an error processing your attendance data.",
            variant: "destructive"
          });
          setIsProcessing(false);
        }
      }, 2000);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={triggerFileUpload}
        disabled={isProcessing}
      >
        <Upload className="h-4 w-4 mr-2" />
        {isProcessing ? "Processing..." : "Upload Attendance Data"}
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.xlsx,.xls"
        className="hidden"
      />
      
      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attendance Report</DialogTitle>
          </DialogHeader>
          
          {reportData && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Attendance Summary Report</h3>
                <p className="text-sm text-muted-foreground">
                  Generated on {new Date(reportData.reportDate).toLocaleDateString()}
                </p>
              </div>
              
              {reportData.employeeReports.map((report: any) => (
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
                        {report.attendanceRecords.slice(0, 5).map((record: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 px-3">{record.date}</td>
                            <td className="py-2 px-3">{record.clockIn}</td>
                            <td className="py-2 px-3">{record.clockOut}</td>
                            <td className="py-2 px-3">{record.workTime}</td>
                          </tr>
                        ))}
                        {report.attendanceRecords.length > 5 && (
                          <tr>
                            <td colSpan={4} className="py-2 px-3 text-center">
                              <Button variant="link" size="sm">
                                View all {report.attendanceRecords.length} records
                              </Button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-4">
                <Button 
                  onClick={() => {
                    toast({
                      title: "Report exported",
                      description: "The attendance report has been exported to Excel format.",
                    });
                    setShowReportDialog(false);
                  }}
                >
                  Export to Excel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttendanceUploader;
