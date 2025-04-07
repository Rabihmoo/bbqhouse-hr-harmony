
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { useCompanyData } from "@/hooks/use-company-data";
import { toast } from "sonner";
import { format } from "date-fns";
import EmployeeSelector from './EmployeeSelector';
import ContractCustomFields from './ContractCustomFields';
import ContractDateFields from './ContractDateFields';
import ContractNotes from './ContractNotes';

interface ContractGeneratorProps {
  onGenerate: (contractData: any) => void;
}

const ContractGenerator: React.FC<ContractGeneratorProps> = ({ onGenerate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [signatureDate, setSignatureDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState<string>('');
  const [baseSalary, setBaseSalary] = useState<number>(8900);
  const [cityOfBirth, setCityOfBirth] = useState<string>('Maputo');
  
  // Use hooks to get employee and company data
  const { employees: activeEmployees } = useEmployeeData(true);
  const { companies } = useCompanyData();

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
    
    // Find the company data if available
    const company = companies.find(comp => comp.name === employee.company);
    
    // Generate contract data
    const contractData = {
      employeeId: employee.id,
      employeeName: employee.fullName,
      position: employee.position,
      company: employee.company,
      // Include company address and NUIT if available
      companyAddress: company ? company.address : 'Avenida 24 de Julho, Maputo',
      companyNuit: company ? company.nuit : '123456789',
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
        // Include city of birth
        cityOfBirth: cityOfBirth,
        // Include salary structure details
        baseSalary: baseSalary,
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
            <EmployeeSelector 
              selectedEmployee={selectedEmployee} 
              setSelectedEmployee={setSelectedEmployee}
              activeEmployees={activeEmployees}
            />
            
            <ContractCustomFields
              baseSalary={baseSalary}
              setBaseSalary={setBaseSalary}
              cityOfBirth={cityOfBirth}
              setCityOfBirth={setCityOfBirth}
            />
            
            <ContractDateFields
              startDate={startDate}
              setStartDate={setStartDate}
              signatureDate={signatureDate}
              setSignatureDate={setSignatureDate}
            />
            
            <ContractNotes 
              notes={notes} 
              setNotes={setNotes} 
            />
            
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
