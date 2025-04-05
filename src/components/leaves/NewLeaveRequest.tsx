import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { LeaveRecord } from "@/types/notification";
import { sendEmailNotification, exportToExcel } from "@/utils/notificationService";

interface NewLeaveRequestProps {
  employees: any[];
  leaveRecords: LeaveRecord[];
  setLeaveRecords: React.Dispatch<React.SetStateAction<LeaveRecord[]>>;
  onSuccess: () => void;
  initialEmployeeId?: string;
}

const NewLeaveRequest = ({ employees, leaveRecords, setLeaveRecords, onSuccess, initialEmployeeId }: NewLeaveRequestProps) => {
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    employeeId: initialEmployeeId || "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    type: "annual" as "annual" | "sick" | "unpaid" | "other",
    notes: ""
  });
  
  useEffect(() => {
    if (initialEmployeeId) {
      setNewLeaveRequest(prev => ({
        ...prev,
        employeeId: initialEmployeeId
      }));
    }
  }, [initialEmployeeId]);
  
  const handleSubmitLeaveRequest = async () => {
    if (!newLeaveRequest.employeeId || !newLeaveRequest.startDate || !newLeaveRequest.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const employee = employees.find(emp => emp.id === newLeaveRequest.employeeId);
    if (!employee) {
      toast.error("Selected employee not found");
      return;
    }
    
    const start = new Date(newLeaveRequest.startDate);
    const end = new Date(newLeaveRequest.endDate);
    let days = 0;
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const newLeave: LeaveRecord = {
      id: `leave-${employee.id}-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.fullName,
      startDate: format(newLeaveRequest.startDate, 'yyyy-MM-dd'),
      endDate: format(newLeaveRequest.endDate, 'yyyy-MM-dd'),
      days,
      type: newLeaveRequest.type,
      status: "scheduled",
      year: newLeaveRequest.startDate.getFullYear(),
      notes: newLeaveRequest.notes
    };
    
    const updatedLeaveRecords = [...leaveRecords, newLeave];
    setLeaveRecords(updatedLeaveRecords);
    localStorage.setItem('bbq-leave-records', JSON.stringify(updatedLeaveRecords));
    
    if (newLeaveRequest.type === 'annual') {
      await sendEmailNotification('leave', newLeave);
      await exportToExcel('leave', newLeave);
    }
    
    setNewLeaveRequest({
      employeeId: "",
      startDate: undefined,
      endDate: undefined,
      type: "annual",
      notes: ""
    });
    
    toast.success("Leave request created successfully");
    onSuccess();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Leave Request</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="employee">Employee</Label>
              <Select
                value={newLeaveRequest.employeeId}
                onValueChange={(value) => setNewLeaveRequest({...newLeaveRequest, employeeId: value})}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees
                    .filter(emp => emp.status === 'Active')
                    .map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.fullName} - {employee.position}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="leave-type">Leave Type</Label>
              <Select
                value={newLeaveRequest.type}
                onValueChange={(value: "annual" | "sick" | "unpaid" | "other") => 
                  setNewLeaveRequest({...newLeaveRequest, type: value})
                }
              >
                <SelectTrigger id="leave-type">
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
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newLeaveRequest.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newLeaveRequest.startDate ? format(newLeaveRequest.startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newLeaveRequest.startDate}
                    onSelect={(date) => setNewLeaveRequest({...newLeaveRequest, startDate: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newLeaveRequest.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newLeaveRequest.endDate ? format(newLeaveRequest.endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newLeaveRequest.endDate}
                    onSelect={(date) => setNewLeaveRequest({...newLeaveRequest, endDate: date})}
                    initialFocus
                    disabled={(date) => 
                      !newLeaveRequest.startDate || date < newLeaveRequest.startDate
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Additional notes about the leave request"
              value={newLeaveRequest.notes}
              onChange={(e) => setNewLeaveRequest({...newLeaveRequest, notes: e.target.value})}
            />
          </div>
          
          <Button 
            onClick={handleSubmitLeaveRequest}
            disabled={!newLeaveRequest.employeeId || !newLeaveRequest.startDate || !newLeaveRequest.endDate}
          >
            Submit Leave Request
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewLeaveRequest;
