
import { useAttendanceUploader } from "@/hooks/use-attendance-uploader";
import AttendanceFileInput from "./AttendanceFileInput";
import AttendanceUploadButton from "./AttendanceUploadButton";
import AttendanceReportDialog from "./AttendanceReportDialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileSpreadsheet } from "lucide-react";

interface AttendanceUploaderProps {
  onFileUploaded?: (reportData?: any) => void;
}

const AttendanceUploader = ({ onFileUploaded }: AttendanceUploaderProps) => {
  const {
    fileInputRef,
    reportData,
    isProcessing,
    showReportDialog,
    setShowReportDialog,
    handleFileChange,
    triggerFileUpload,
    fileName
  } = useAttendanceUploader(onFileUploaded);

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Upload Attendance Data</CardTitle>
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Upload the ATT MACHINE.xlsx file containing attendance logs to generate employee declarations.
          </p>
          
          <AttendanceUploadButton 
            onClick={triggerFileUpload}
            isProcessing={isProcessing}
          />
          
          <AttendanceFileInput
            fileInputRef={fileInputRef}
            onChange={handleFileChange}
          />
        </CardContent>
      </Card>
      
      {/* Report Dialog */}
      <AttendanceReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        reportData={reportData}
      />
    </>
  );
};

export default AttendanceUploader;
