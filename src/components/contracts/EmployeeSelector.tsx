
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Employee {
  id: string;
  fullName: string;
  position: string;
}

interface EmployeeSelectorProps {
  selectedEmployee: string;
  setSelectedEmployee: (id: string) => void;
  activeEmployees: Employee[];
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  selectedEmployee,
  setSelectedEmployee,
  activeEmployees
}) => {
  return (
    <div>
      <Label htmlFor="employee">Select Employee</Label>
      <Select
        value={selectedEmployee}
        onValueChange={setSelectedEmployee}
      >
        <SelectTrigger id="employee">
          <SelectValue placeholder="Select an employee" />
        </SelectTrigger>
        <SelectContent>
          {activeEmployees.length > 0 ? (
            activeEmployees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.fullName} - {employee.position}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>No active employees found</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EmployeeSelector;
