
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface AttendanceUploaderProps {
  onFileUploaded?: () => void;
}

const AttendanceUploader = ({ onFileUploaded }: AttendanceUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would process the CSV/Excel file
      // For now, we'll just show a toast that it's being processed
      toast({
        title: "Attendance data received",
        description: "Your file is being processed. You'll be notified when it's complete.",
      });
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Simulate processing completion after 2 seconds
      setTimeout(() => {
        toast({
          title: "Attendance data processed",
          description: "Your attendance data has been successfully imported.",
        });
        if (onFileUploaded) onFileUploaded();
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.xlsx,.xls"
        className="hidden"
      />
    </>
  );
};

export default AttendanceUploader;
