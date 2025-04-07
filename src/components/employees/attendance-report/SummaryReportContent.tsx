
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AttendanceReport } from "@/utils/attendanceProcessor";
import { SummaryTable } from "./SummaryTable";

interface SummaryReportContentProps {
  reportData: AttendanceReport;
}

export function SummaryReportContent({ reportData }: SummaryReportContentProps) {
  const { toast } = useToast();

  const handleExportAll = () => {
    toast({
      title: "Reports exported",
      description: "All attendance declarations have been prepared for export.",
    });
  };

  return (
    <div className="space-y-6">
      <SummaryTable reportData={reportData} />
      
      <div className="text-center pt-4">
        <Button onClick={handleExportAll}>
          <Download className="h-4 w-4 mr-2" />
          Export All Declarations
        </Button>
      </div>
    </div>
  );
}
