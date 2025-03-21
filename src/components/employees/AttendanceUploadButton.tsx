
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface AttendanceUploadButtonProps {
  onClick: () => void;
  isProcessing: boolean;
}

const AttendanceUploadButton = ({ onClick, isProcessing }: AttendanceUploadButtonProps) => {
  return (
    <Button 
      variant="outline" 
      onClick={onClick}
      disabled={isProcessing}
    >
      <Upload className="h-4 w-4 mr-2" />
      {isProcessing ? "Processing..." : "Upload Attendance Data"}
    </Button>
  );
};

export default AttendanceUploadButton;
