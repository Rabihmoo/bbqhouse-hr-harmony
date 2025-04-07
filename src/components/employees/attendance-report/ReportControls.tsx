
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReportControlsProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  month: string;
  setMonth: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
}

export function ReportControls({
  companyName,
  setCompanyName,
  month,
  setMonth,
  year,
  setYear
}: ReportControlsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="company-name">Company Name</Label>
        <Input
          id="company-name"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          placeholder="Enter company name"
        />
      </div>
      <div>
        <Label htmlFor="report-month">Month</Label>
        <Input
          id="report-month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          placeholder="Enter month name"
        />
      </div>
      <div>
        <Label htmlFor="report-year">Year</Label>
        <Input
          id="report-year"
          value={year}
          onChange={e => setYear(e.target.value)}
          placeholder="Enter year"
        />
      </div>
    </div>
  );
}
