import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useEmployeeData } from "@/hooks/use-employee-data";

interface LeaveRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  employees?: any[];
  initialEmployeeId?: string;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ 
  open, 
  onClose,
  onSubmit,
  employees: providedEmployees,
  initialEmployeeId 
}) => {
  const [employeeId, setEmployeeId] = useState(initialEmployeeId || "");
  const [leaveType, setLeaveType] = useState("annual");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [notes, setNotes] = useState("");
  
  const { employees: activeEmployees } = useEmployeeData(true);
  const employees = providedEmployees || activeEmployees;
  
  useEffect(() => {
    if (initialEmployeeId) {
      setEmployeeId(initialEmployeeId);
    }
  }, [initialEmployeeId]);
  
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    return differenceInDays(endDate, startDate) + 1;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const days = calculateDays();
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (!employee) {
      alert("Please select an employee");
      return;
    }
    
    if (days <= 0) {
      alert("End date must be after start date");
      return;
    }
    
    onSubmit({
      employeeId,
      type: leaveType,
      startDate: format(startDate!, "yyyy-MM-dd"),
      endDate: format(endDate!, "yyyy-MM-dd"),
      days,
      year: startDate!.getFullYear(),
      status: "scheduled",
      notes
    });
    
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Leave Record</DialogTitle>
          <DialogDescription>
            Record a leave period for an employee.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">
                Employee
              </Label>
              <div className="col-span-3">
                <Select 
                  value={employeeId} 
                  onValueChange={setEmployeeId}
                >
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.fullName} - {employee.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="leaveType" className="text-right">
                Leave Type
              </Label>
              <div className="col-span-3">
                <Select 
                  value={leaveType} 
                  onValueChange={setLeaveType}
                >
                  <SelectTrigger id="leaveType">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Start Date</Label>
              <div className="col-span-3">
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        if (endDate && date && endDate < date) {
                          setEndDate(date);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">End Date</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => 
                        startDate ? date < startDate : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Days</Label>
              <div className="col-span-3">
                <Input 
                  value={calculateDays()} 
                  readOnly 
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional information about this leave"
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestForm;
