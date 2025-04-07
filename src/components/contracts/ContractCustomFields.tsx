
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContractCustomFieldsProps {
  baseSalary: number;
  setBaseSalary: (value: number) => void;
  cityOfBirth: string;
  setCityOfBirth: (value: string) => void;
}

const ContractCustomFields: React.FC<ContractCustomFieldsProps> = ({
  baseSalary,
  setBaseSalary,
  cityOfBirth,
  setCityOfBirth
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Base Salary (MT)</Label>
        <Input
          type="number"
          value={baseSalary}
          onChange={(e) => setBaseSalary(Number(e.target.value))}
          placeholder="Base Salary"
        />
      </div>
      
      <div>
        <Label>City of Birth</Label>
        <Input
          type="text"
          value={cityOfBirth}
          onChange={(e) => setCityOfBirth(e.target.value)}
          placeholder="City of Birth"
        />
      </div>
    </div>
  );
};

export default ContractCustomFields;
