
import { useAttendanceUploader } from "@/hooks/use-attendance-uploader";
import AttendanceFileInput from "./AttendanceFileInput";
import AttendanceUploadButton from "./AttendanceUploadButton";
import AttendanceReportDialog from "./AttendanceReportDialog";

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
    triggerFileUpload
  } = useAttendanceUploader(onFileUploaded);

  return (
    <>
      <AttendanceUploadButton 
        onClick={triggerFileUpload}
        isProcessing={isProcessing}
      />
      
      <AttendanceFileInput
        fileInputRef={fileInputRef}
        onChange={handleFileChange}
      />
      
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
