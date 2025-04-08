
import { useState } from "react";
import { useAttendanceUploader } from "@/hooks/use-attendance-uploader";
import AttendanceFileInput from "./AttendanceFileInput";
import AttendanceUploadButton from "./AttendanceUploadButton";
import AttendanceReportDialog from "./AttendanceReportDialog";
import PreviewDeclarationsDialog from "./PreviewDeclarationsDialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileSpreadsheet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExportSettingsDialog } from "./ExportSettingsDialog";

interface AttendanceUploaderProps {
  onFileUploaded?: (reportData?: any) => void;
}

const AttendanceUploader = ({ onFileUploaded }: AttendanceUploaderProps) => {
  const {
    fileInputRef,
    reportData,
    isProcessing,
    fileName,
    showReportDialog,
    setShowReportDialog,
    showPreviewDialog,
    setShowPreviewDialog,
    showExportDialog,
    setShowExportDialog,
    handleFileChange,
    triggerFileUpload,
    handleExportDeclarations
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
          
          <div className="flex flex-wrap items-center gap-2">
            <AttendanceUploadButton 
              onClick={triggerFileUpload}
              isProcessing={isProcessing}
            />
            
            {fileName && (
              <Badge variant="secondary" className="text-xs">
                {fileName}
              </Badge>
            )}
          </div>

          {fileName && !isProcessing && (
            <div className="mt-4 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPreviewDialog(true)}
              >
                Preview Declarations
              </Button>
              
              <Button 
                size="sm" 
                onClick={() => setShowExportDialog(true)}
              >
                Export Declarations
              </Button>
            </div>
          )}
          
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

      {/* Preview Dialog */}
      <PreviewDeclarationsDialog
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        reportData={reportData}
      />

      {/* Export Settings Dialog */}
      <ExportSettingsDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        reportData={reportData}
        onExport={handleExportDeclarations}
      />
    </>
  );
};

export default AttendanceUploader;
