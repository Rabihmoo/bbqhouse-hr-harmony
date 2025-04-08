
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface FormatSectionProps {
  exportFormat: 'excel' | 'pdf' | 'both';
  setExportFormat: (format: 'excel' | 'pdf' | 'both') => void;
  includeSignature: boolean;
  setIncludeSignature: (include: boolean) => void;
}

export function FormatSection({
  exportFormat,
  setExportFormat,
  includeSignature,
  setIncludeSignature
}: FormatSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>Export Format</Label>
        <Select value={exportFormat} onValueChange={(value: 'excel' | 'pdf' | 'both') => setExportFormat(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excel">Excel Only</SelectItem>
            <SelectItem value="pdf">PDF Only</SelectItem>
            <SelectItem value="both">Both Excel & PDF</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="includeSignature"
          checked={includeSignature}
          onCheckedChange={(checked) => setIncludeSignature(!!checked)}
        />
        <Label htmlFor="includeSignature">Include signature image (if available)</Label>
      </div>
    </>
  );
}
