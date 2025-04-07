
import React from 'react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface AddAttendanceTabProps {
  newAttendance: {
    employeeId: string;
    date: Date;
    clockIn: string;
    clockOut: string;
    status: 'present' | 'absent' | 'late' | 'half-day';
    notes: string;
  };
  setNewAttendance: (attendance: any) => void;
  employees: any[];
  activeCompany: string;
  handleSubmitAttendance: () => void;
}

export const AddAttendanceTab = ({
  newAttendance,
  setNewAttendance,
  employees,
  activeCompany,
  handleSubmitAttendance
}: AddAttendanceTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Attendance Record</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="attendance-employee">Employee</Label>
              <Select
                value={newAttendance.employeeId}
                onValueChange={(value) => setNewAttendance({...newAttendance, employeeId: value})}
              >
                <SelectTrigger id="attendance-employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees
                    .filter(emp => emp.status === 'Active')
                    .filter(emp => {
                      if (activeCompany === 'all') return true;
                      return emp.company?.toLowerCase().includes(activeCompany);
                    })
                    .map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.fullName} - {employee.position}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="attendance-status">Status</Label>
              <Select
                value={newAttendance.status}
                onValueChange={(value: 'present' | 'absent' | 'late' | 'half-day') => 
                  setNewAttendance({...newAttendance, status: value})
                }
              >
                <SelectTrigger id="attendance-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newAttendance.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newAttendance.date ? format(newAttendance.date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newAttendance.date}
                  onSelect={(date) => date && setNewAttendance({...newAttendance, date})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {newAttendance.status !== 'absent' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="clock-in">Clock In</Label>
                <Input
                  id="clock-in"
                  type="time"
                  value={newAttendance.clockIn}
                  onChange={(e) => setNewAttendance({...newAttendance, clockIn: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="clock-out">Clock Out</Label>
                <Input
                  id="clock-out"
                  type="time"
                  value={newAttendance.clockOut}
                  onChange={(e) => setNewAttendance({...newAttendance, clockOut: e.target.value})}
                />
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="attendance-notes">Notes</Label>
            <Input
              id="attendance-notes"
              placeholder="Additional notes"
              value={newAttendance.notes}
              onChange={(e) => setNewAttendance({...newAttendance, notes: e.target.value})}
            />
          </div>
          
          <Button 
            onClick={handleSubmitAttendance}
            disabled={!newAttendance.employeeId || !newAttendance.date}
          >
            Save Attendance Record
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
