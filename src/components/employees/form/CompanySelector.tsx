
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { companies } from "@/lib/data";

interface CompanySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CompanySelector = ({ value, onValueChange }: CompanySelectorProps) => {
  return (
    <div>
      <Label htmlFor="company" className="mb-1">
        Company*
      </Label>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger id="company">
          <SelectValue placeholder="Select company" />
        </SelectTrigger>
        <SelectContent>
          {companies.map(company => (
            <SelectItem key={company.id} value={company.name}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanySelector;
