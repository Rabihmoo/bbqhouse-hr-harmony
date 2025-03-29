
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CompanyFilterProps {
  activeCompany: string;
  onCompanyChange: (value: string) => void;
}

const CompanyFilter = ({ activeCompany, onCompanyChange }: CompanyFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="company-filter">Filter by company:</Label>
      <Select
        value={activeCompany}
        onValueChange={onCompanyChange}
      >
        <SelectTrigger id="company-filter" className="w-[180px]">
          <SelectValue placeholder="Select company" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Companies</SelectItem>
          <SelectItem value="bbqhouse">BBQHouse LDA</SelectItem>
          <SelectItem value="salt">SALT LDA</SelectItem>
          <SelectItem value="executive">Executive Cleaning LDA</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanyFilter;
