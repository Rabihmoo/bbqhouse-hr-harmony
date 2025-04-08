
import { useState, useRef } from "react";
import { toast } from "sonner";
import { processAttendanceData } from "@/utils/attendance/dataProcessor";
import type { AttendanceReport } from "@/utils/attendance/types";
import { exportEmployeeDeclarations } from "@/utils/attendance/exportUtils";

export type ExportOptions = {
  format: 'excel' | 'pdf' | 'both';
  includeSignature: boolean;
  sendEmail: boolean;
  emailAddress?: string;
  filters: {
    department?: string;
    branch?: string;
    status?: 'active' | 'all';
    employees?: string[];
  };
};

export const useAttendanceUploader = (onFileUploaded?: (reportData?: AttendanceReport) => void) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reportData, setReportData] = useState<AttendanceReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setIsProcessing(true);
      
      toast.info(`Processing ${file.name}`, {
        description: "Attendance data is being processed. You can preview and export when ready.",
      });
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      try {
        const data = await processAttendanceData(file, false); // false means don't auto-export
        setReportData(data);
        setIsProcessing(false);
        
        toast.success("File uploaded successfully", {
          description: `${file.name} has been processed. You can now preview or export declarations.`,
        });
        
        if (onFileUploaded) onFileUploaded(data);
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Processing failed", {
          description: "There was an error processing your attendance data file.",
        });
        setIsProcessing(false);
      }
    }
  };

  const handleExportDeclarations = async (options: ExportOptions) => {
    if (!reportData) {
      toast.error("No data available", {
        description: "Please upload an attendance file first.",
      });
      return;
    }

    setIsProcessing(true);
    toast.info("Generating declarations", {
      description: "Creating declaration files for all employees. This may take a moment.",
    });

    try {
      await exportEmployeeDeclarations(reportData, options);
      
      toast.success("Declarations exported", {
        description: "All declaration files have been generated and saved successfully.",
      });

      // Close the dialog
      setShowExportDialog(false);
      
      // If email option was selected
      if (options.sendEmail && options.emailAddress) {
        toast.success("Email sent", {
          description: `Declarations were sent to ${options.emailAddress}`,
        });
      }
    } catch (error) {
      console.error("Error exporting declarations:", error);
      toast.error("Export failed", {
        description: "There was an error generating the declaration files.",
      });
    } finally {
      setIsProcessing(false);
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
    showPreviewDialog,
    setShowPreviewDialog,
    showExportDialog,
    setShowExportDialog,
    handleFileChange,
    triggerFileUpload,
    handleExportDeclarations,
    fileName
  };
};
