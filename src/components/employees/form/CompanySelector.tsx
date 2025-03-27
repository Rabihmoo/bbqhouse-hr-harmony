
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { companies } from "@/lib/data";

interface CompanySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CompanySelector = ({ value, onValueChange }: CompanySelectorProps) => {
  // Ensure the value is never undefined or null when passed to Select
  const safeValue = value || "";
  
  return (
    <div>
      <Label htmlFor="company" className="mb-1">
        Company*
      </Label>
      <Select
        name="company"
        value={safeValue}
        onValueChange={(newValue) => {
          console.log("Company selected:", newValue);
          onValueChange(newValue);
        }}
      >
        <SelectTrigger id="company" className="w-full">
          <SelectValue placeholder="Select company" />
        </SelectTrigger>
        <SelectContent position="popper" className="max-h-[var(--radix-select-content-available-height)] bg-white dark:bg-gray-800" style={{ zIndex: 9999 }}>
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
