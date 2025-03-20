
import { useState } from "react";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { employees } from "@/lib/data";

interface ContractGeneratorProps {
  onGenerate: (data: any) => void;
}

const ContractGenerator = ({ onGenerate }: ContractGeneratorProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [contractType, setContractType] = useState("standard");
  const [duration, setDuration] = useState("6");
  const [startDate, setStartDate] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const currentDate = new Date().toISOString().split("T")[0];
  
  const employee = employees.find(emp => emp.id === selectedEmployee);

  const handleGenerate = () => {
    const contractData = {
      employeeId: selectedEmployee,
      contractType,
      duration: Number(duration),
      startDate: startDate || currentDate,
    };
    
    onGenerate(contractData);
  };

  return (
    <div className="bg-white dark:bg-black/40 rounded-xl shadow-sm overflow-hidden glass p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-bbqred p-2 rounded-lg text-white">
          <FileText className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold">Contract Generator</h2>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="employee">Select Employee</Label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger id="employee">
              <SelectValue placeholder="Choose an employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.fullName} - {employee.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contractType">Contract Type</Label>
          <Select value={contractType} onValueChange={setContractType}>
            <SelectTrigger id="contractType">
              <SelectValue placeholder="Select contract type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Contract</SelectItem>
              <SelectItem value="temporary">Temporary Contract</SelectItem>
              <SelectItem value="parttime">Part-Time Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="duration">Duration (Months)</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger id="duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Months</SelectItem>
              <SelectItem value="6">6 Months</SelectItem>
              <SelectItem value="12">12 Months</SelectItem>
              <SelectItem value="24">24 Months</SelectItem>
              <SelectItem value="36">36 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={currentDate}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <Button 
            className="w-full" 
            disabled={!selectedEmployee} 
            onClick={handleGenerate}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Contract
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            disabled={!selectedEmployee}
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {employee && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-2xl glass">
            <DialogHeader>
              <DialogTitle>Contract Preview</DialogTitle>
            </DialogHeader>
            <div className="mt-2 p-6 border rounded-lg bg-card text-card-foreground">
              <div className="flex justify-center mb-8">
                <img 
                  src="/lovable-uploads/3b0f2146-354a-4718-b5d4-d20dc1907ba1.png" 
                  alt="BBQ House Logo" 
                  className="w-40 h-40 object-contain" 
                />
              </div>
              
              <h2 className="text-center text-2xl font-bold mb-8 uppercase">
                Employment Contract
              </h2>
              
              <div className="space-y-6 text-base">
                <p>
                  <strong>This Employment Contract</strong> is entered into on {startDate || currentDate} between:
                </p>
                
                <p>
                  <strong>BBQHOUSE</strong>, hereinafter referred to as "the Employer"
                </p>
                
                <p>and</p>
                
                <p>
                  <strong>{employee.fullName}</strong>, BI Number: {employee.biNumber}, hereinafter referred to as "the Employee"
                </p>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">1. Position and Duties</h3>
                  <p>
                    The Employee is hired for the position of {employee.position} in the {employee.department} department.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">2. Compensation</h3>
                  <p>
                    The Employee shall receive a monthly salary of {employee.salary.toLocaleString()} KZ.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">3. Term</h3>
                  <p>
                    This contract shall be valid for a period of {duration} months, commencing on {startDate || currentDate}.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">4. Additional Terms</h3>
                  <p>
                    Full terms and conditions are detailed in the complete contract document.
                  </p>
                </div>
                
                <div className="pt-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="mb-10">Employer Signature:</p>
                      <div className="border-t border-black w-full"></div>
                      <p className="mt-2">BBQHOUSE Representative</p>
                    </div>
                    
                    <div>
                      <p className="mb-10">Employee Signature:</p>
                      <div className="border-t border-black w-full"></div>
                      <p className="mt-2">{employee.fullName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContractGenerator;
