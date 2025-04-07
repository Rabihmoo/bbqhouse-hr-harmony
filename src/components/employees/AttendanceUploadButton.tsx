
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
      className="flex items-center gap-2"
    >
      <Upload className="h-4 w-4" />
      {isProcessing ? "Processing..." : "Upload ATT MACHINE.xlsx"}
    </Button>
  );
};

export default AttendanceUploadButton;
