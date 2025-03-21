import { useState, useEffect } from "react";
import { Calendar, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { LeaveType, employees, calculateLeaveAllowance, getEmployeeYearsOfService } from "@/lib/data";
import { parseISO, differenceInDays, addDays, format } from "date-fns";
import { LeaveAllowance } from "@/types/notification";

interface LeaveRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialEmployeeId?: string;
}

const LeaveRequestForm = ({ open, onClose, onSubmit, initialEmployeeId }: LeaveRequestFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    employeeId: initialEmployeeId || "",
    startDate: "",
    endDate: "",
    type: "Annual" as LeaveType,
    reason: "",
    year: new Date().getFullYear().toString()
  });
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [daysCount, setDaysCount] = useState<number>(0);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  useEffect(() => {
    if (open) {
      setFormData({
        employeeId: initialEmployeeId || "",
        startDate: "",
        endDate: "",
        type: "Annual" as LeaveType,
        reason: "",
        year: new Date().getFullYear().toString()
      });
      setSelectedFile(null);
    }
  }, [open, initialEmployeeId]);

  useEffect(() => {
    if (formData.employeeId) {
      const employee = employees.find(emp => emp.id === formData.employeeId);
      setSelectedEmployee(employee);
      
      if (employee?.hireDate) {
        const hireDate = parseISO(employee.hireDate);
        const hireYear = hireDate.getFullYear();
        const currentYear = new Date().getFullYear();
        
        const eligibleYears: number[] = [];
        for (let year = hireYear + 1; year <= currentYear; year++) {
          eligibleYears.push(year);
        }
        
        setAvailableYears(eligibleYears);
        
        if (eligibleYears.includes(currentYear)) {
          setFormData(prev => ({ ...prev, year: currentYear.toString() }));
        } else if (eligibleYears.length > 0) {
          setFormData(prev => ({ ...prev, year: eligibleYears[eligibleYears.length - 1].toString() }));
        }
      }
    }
  }, [formData.employeeId]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = parseISO(formData.startDate);
      const end = parseISO(formData.endDate);
      
      const days = differenceInDays(end, start) + 1;
      setDaysCount(days > 0 ? days : 0);
    } else {
      setDaysCount(0);
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const leaveRecord = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: daysCount,
      year: parseInt(formData.year),
      type: formData.type.toLowerCase() as 'annual' | 'sick' | 'unpaid' | 'other',
      status: 'completed' as 'completed' | 'scheduled',
      notes: formData.reason,
      employeeId: formData.employeeId,
      employeeName: selectedEmployee?.fullName || ""
    };
    
    onSubmit(leaveRecord);
    onClose();
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  const getYearLeaveBalance = () => {
    if (!selectedEmployee || !formData.year) return null;
    
    const year = parseInt(formData.year);
    const allowance = selectedEmployee.leaveAllowances?.find(
      (a: LeaveAllowance) => a.year === year
    );
    
    if (!allowance) {
      const yearsEmployed = year - parseISO(selectedEmployee.hireDate).getFullYear();
      const entitledDays = calculateLeaveAllowance(yearsEmployed);
      return {
        entitled: entitledDays,
        taken: 0,
        remaining: entitledDays
      };
    }
    
    return {
      entitled: allowance.daysEntitled,
      taken: allowance.daysTaken,
      remaining: allowance.remaining
    };
  };

  const leaveBalance = getYearLeaveBalance();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass">
        <DialogHeader>
          <DialogTitle>Add Leave Record</DialogTitle>
          <DialogDescription>
            {initialEmployeeId ? 
              "Record leave for this employee" : 
              "Fill out the form below to record employee leave."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employeeId">Employee</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => handleSelectChange("employeeId", value)}
                disabled={!!initialEmployeeId}
              >
                <SelectTrigger id="employeeId">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEmployee && (
              <div className="grid gap-2">
                <Label htmlFor="year">Leave Year</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => handleSelectChange("year", value)}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {leaveBalance && (
                  <div className="p-3 bg-muted/30 rounded-md text-sm">
                    <p>Entitled: {leaveBalance.entitled} days</p>
                    <p>Taken: {leaveBalance.taken} days</p>
                    <p className="font-medium">Remaining: {leaveBalance.remaining} days</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="startDate"
                    name="startDate"
                    type="date"
                    className="pl-10"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="endDate"
                    name="endDate"
                    type="date"
                    className="pl-10"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {daysCount > 0 && (
              <div className="text-sm text-center bg-muted/30 p-2 rounded-md">
                Total: <span className="font-medium">{daysCount} days</span>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="type">Leave Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value as LeaveType)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual">Annual Leave</SelectItem>
                  <SelectItem value="Sick">Sick Leave</SelectItem>
                  <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Notes (Optional)</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Enter any notes about this leave"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="document">Supporting Document (optional)</Label>
              <div className="border border-input bg-background rounded-md">
                {selectedFile ? (
                  <div className="flex items-center justify-between p-3">
                    <span className="text-sm truncate">
                      {selectedFile.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={clearFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="document"
                    className="flex flex-col items-center justify-center p-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Upload className="h-5 w-5 mb-2" />
                    <span className="text-sm">Click to upload</span>
                    <input
                      id="document"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!formData.employeeId || !formData.startDate || !formData.endDate || daysCount <= 0}
            >
              Record Leave
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestForm;
