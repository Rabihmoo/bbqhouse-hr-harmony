
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { employees, companies } from '@/lib/data';

interface ContractGeneratorProps {
  onGenerate: (contractData: any) => void;
}

const ContractGenerator: React.FC<ContractGeneratorProps> = ({ onGenerate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [signatureDate, setSignatureDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState<string>('');
  
  // Filter only active employees
  const activeEmployees = employees.filter(emp => 
    emp.status === 'Active' || emp.status === 'On Leave'
  );

  const handleGenerate = () => {
    if (!selectedEmployee) return;
    
    const employee = activeEmployees.find(emp => emp.id === selectedEmployee);
    if (!employee) return;
    
    const company = companies.find(c => c.name === employee.company);
    
    onGenerate({
      employeeId: employee.id,
      employeeName: employee.fullName,
      position: employee.position,
      company: employee.company,
      companyTemplate: company?.contractTemplate || '',
      startDate: startDate ? format(startDate, 'dd/MM/yyyy') : '',
      signatureDate: signatureDate ? format(signatureDate, 'dd/MM/yyyy') : '',
      notes,
      employeeInfo: {
        biNumber: employee.biNumber,
        address: employee.address,
        secondAddress: employee.secondAddress,
        biValidUntil: employee.biValidUntil,
        // Include salary structure details
        transportAllowance: employee.salaryStructure?.transportAllowance || 0,
        bonus: employee.salaryStructure?.bonus || 0,
      }
    });
    
    // Reset form after generation
    setNotes('');
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-bbqred p-2 rounded-lg text-white">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Generate Contract</h2>
          </div>
          
          <div className="space-y-4">
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
                  {activeEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.fullName} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>Signature Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !signatureDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {signatureDate ? format(signatureDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={signatureDate}
                      onSelect={setSignatureDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special clauses or notes for this contract"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleGenerate} 
              className="w-full"
              disabled={!selectedEmployee || !startDate || !signatureDate}
            >
              Generate Contract
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractGenerator;
