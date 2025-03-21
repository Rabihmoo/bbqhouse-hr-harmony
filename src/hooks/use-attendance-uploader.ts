
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { processAttendanceData, AttendanceReport } from "@/utils/attendanceProcessor";

export const useAttendanceUploader = (onFileUploaded?: (reportData?: any) => void) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reportData, setReportData] = useState<AttendanceReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { toast } = useToast();

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

  return {
    fileInputRef,
    reportData,
    isProcessing,
    showReportDialog,
    setShowReportDialog,
    handleFileChange,
    triggerFileUpload
  };
};
