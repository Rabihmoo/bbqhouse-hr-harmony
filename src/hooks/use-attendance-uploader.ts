
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { processAttendanceData, AttendanceReport } from "@/utils/attendanceProcessor";

export const useAttendanceUploader = (onFileUploaded?: (reportData?: any) => void) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reportData, setReportData] = useState<AttendanceReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setIsProcessing(true);
      
      toast({
        title: `Processing ${file.name}`,
        description: "Your attendance data is being processed. You'll be notified when it's complete.",
      });
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Process the file (simulate with timeout for demo)
      setTimeout(() => {
        try {
          const data = processAttendanceData(file);
          setReportData(data);
          
          toast({
            title: "Attendance data processed",
            description: `Successfully processed attendance records from ${file.name}.`,
          });
          
          setShowReportDialog(true);
          setIsProcessing(false);
          
          if (onFileUploaded) onFileUploaded(data);
        } catch (error) {
          console.error("Error processing file:", error);
          toast({
            title: "Processing failed",
            description: "There was an error processing your attendance data file.",
            variant: "destructive"
          });
          setIsProcessing(false);
        }
      }, 1500);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return {
    fileInputRef,
    reportData,
    isProcessing,
    showReportDialog,
    setShowReportDialog,
    handleFileChange,
    triggerFileUpload,
    fileName
  };
};
