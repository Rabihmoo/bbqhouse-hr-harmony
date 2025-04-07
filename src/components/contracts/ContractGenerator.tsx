
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { toast } from "sonner";

interface ContractGeneratorProps {
  onGenerate: (contractData: any) => void;
}

const ContractGenerator: React.FC<ContractGeneratorProps> = ({ onGenerate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [signatureDate, setSignatureDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState<string>('');
  
  // Use our hook to get only active employees - ensure activeOnly is true
  const { employees: activeEmployees } = useEmployeeData(true);

  const handleGenerate = () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee first");
      return;
    }
    
    const employee = activeEmployees.find(emp => emp.id === selectedEmployee);
    if (!employee) {
      toast.error("Selected employee not found or no longer active");
      return;
    }
    
    // Generate contract PDF (in a real system)
    // For now, we'll just create the data structure
    const contractData = {
      employeeId: employee.id,
      employeeName: employee.fullName,
      position: employee.position,
      company: employee.company,
      companyTemplate: employee.company ? `${employee.company.replace(/ /g, '_')}_Contract.pdf` : 'Default_Contract.pdf',
      startDate: startDate ? format(startDate, 'dd/MM/yyyy') : '',
      signatureDate: signatureDate ? format(signatureDate, 'dd/MM/yyyy') : '',
      notes,
      employeeInfo: {
        biNumber: employee.biNumber,
        biDetails: employee.biDetails || { 
          issueDate: employee.biValidUntil ? '01/01/2020' : '', 
          expiryDate: employee.biValidUntil || '' 
        },
        address: employee.address,
        secondAddress: employee.secondAddress,
        biValidUntil: employee.biValidUntil,
        // Include salary structure details
        transportAllowance: employee.salaryStructure?.transportAllowance || 0,
        bonus: employee.salaryStructure?.bonus || 0,
        accommodationAllowance: employee.salaryStructure?.accommodationAllowance || 0,
      }
    };
    
    onGenerate(contractData);
    
    // Reset form after generation
    setNotes('');
    toast.success("Contract generated successfully", {
      description: `Contract for ${employee.fullName} has been generated and is ready for download`
    });
  };

  useEffect(() => {
    // Reset selected employee if it's not in the active list
    if (selectedEmployee && activeEmployees.length > 0) {
      const stillActive = activeEmployees.some(emp => emp.id === selectedEmployee);
      if (!stillActive) {
        setSelectedEmployee('');
      }
    }
  }, [activeEmployees, selectedEmployee]);

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
