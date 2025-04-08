
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { AttendanceReport } from "@/utils/attendance/types";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileDown, Mail } from "lucide-react";
import { ExportOptions } from "@/hooks/use-attendance-uploader";

// Import our new components
import { FormatSection } from "./export/FormatSection";
import { EmailSection } from "./export/EmailSection";
import { FilterSection } from "./export/FilterSection";

interface ExportSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: AttendanceReport | null;
  onExport: (options: ExportOptions) => void;
}

export function ExportSettingsDialog({
  open,
  onOpenChange,
  reportData,
  onExport
}: ExportSettingsDialogProps) {
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'both'>('excel');
  const [includeSignature, setIncludeSignature] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'all'>('active');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  if (!reportData) return null;

  const handleExport = () => {
    onExport({
      format: exportFormat,
      includeSignature,
      sendEmail,
      emailAddress: sendEmail ? emailAddress : undefined,
      filters: {
        department: selectedDepartments.length > 0 ? selectedDepartments.join(",") : undefined,
        branch: selectedBranches.length > 0 ? selectedBranches.join(",") : undefined,
        status: selectedStatus,
        employees: selectedEmployees.length > 0 ? selectedEmployees : undefined
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Settings</DialogTitle>
          <DialogDescription>
            Configure how you want to export employee declarations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <FormatSection 
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            includeSignature={includeSignature}
            setIncludeSignature={setIncludeSignature}
          />

          <EmailSection
            sendEmail={sendEmail}
            setSendEmail={setSendEmail}
            emailAddress={emailAddress}
            setEmailAddress={setEmailAddress}
          />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="filters">
              <AccordionTrigger>Advanced Filters</AccordionTrigger>
              <AccordionContent>
                <FilterSection
                  reportData={reportData}
                  selectedDepartments={selectedDepartments}
                  setSelectedDepartments={setSelectedDepartments}
                  selectedBranches={selectedBranches}
                  setSelectedBranches={setSelectedBranches}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  selectedEmployees={selectedEmployees}
                  setSelectedEmployees={setSelectedEmployees}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2">
            {sendEmail ? <Mail className="h-4 w-4" /> : <FileDown className="h-4 w-4" />}
            Export Declarations
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
