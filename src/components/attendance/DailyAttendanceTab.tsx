
import React from 'react';
import { format, subDays, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { AttendanceRecord } from '@/types/attendance';

interface DailyAttendanceTabProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  filteredDailyRecords: AttendanceRecord[];
  employeesWithoutAttendance: any[];
  setActiveTab: (tab: string) => void;
  setNewAttendance: (attendance: any) => void;
}

export const DailyAttendanceTab = ({
  selectedDate,
  setSelectedDate,
  filteredDailyRecords,
  employeesWithoutAttendance,
  setActiveTab,
  setNewAttendance
}: DailyAttendanceTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <CardTitle>Daily Attendance</CardTitle>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button 
            variant="outline" 
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            Next
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredDailyRecords.length > 0 ? (
          <DataTable
            data={filteredDailyRecords}
            columns={[
              {
                key: "employeeName",
                header: "Employee",
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {row.employeeName}
                  </div>
                ),
              },
              {
                key: "clockIn",
                header: "Clock In",
                render: (row) => (
                  <div>
                    {row.status === 'absent' ? (
                      <span className="text-red-500">Absent</span>
                    ) : (
                      row.clockIn
                    )}
                  </div>
                ),
              },
              {
                key: "clockOut",
                header: "Clock Out",
                render: (row) => (
                  <div>
                    {row.status === 'absent' ? (
                      <span>-</span>
                    ) : (
                      row.clockOut
                    )}
                  </div>
                ),
              },
              {
                key: "totalHours",
                header: "Total Hours",
                render: (row) => (
                  <div>
                    {row.status === 'absent' ? (
                      <span>0</span>
                    ) : (
                      `${row.totalHours} hrs`
                    )}
                  </div>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs inline-block",
                    row.status === 'present' ? "bg-green-100 text-green-800" :
                    row.status === 'absent' ? "bg-red-100 text-red-800" :
                    row.status === 'late' ? "bg-amber-100 text-amber-800" :
                    "bg-blue-100 text-blue-800"
                  )}>
                    <span className="capitalize">{row.status}</span>
                  </div>
                ),
              },
              {
                key: "notes",
                header: "Notes",
                render: (row) => (
                  <div>
                    {row.notes || "-"}
                  </div>
                ),
              },
              {
                key: "actions",
                header: "",
                render: (row) => (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      setNewAttendance({
                        employeeId: row.employeeId,
                        date: new Date(row.date),
                        clockIn: row.clockIn || "08:00",
                        clockOut: row.clockOut || "17:00",
                        status: row.status,
                        notes: row.notes || ""
                      });
                      setActiveTab("add");
                    }}
                  >
                    Edit
                  </Button>
                ),
              },
            ]}
            searchable
            pagination
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No attendance records for this date.</p>
            {employeesWithoutAttendance.length > 0 && (
              <>
                <p className="mb-2">Employees without attendance records:</p>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 max-w-2xl mx-auto">
                  {employeesWithoutAttendance.map(employee => (
                    <div key={employee.id} className="border rounded-md p-2 text-sm">
                      {employee.fullName}
                    </div>
                  ))}
                </div>
                <Button 
                  className="mt-4"
                  onClick={() => setActiveTab("add")}
                >
                  Add Attendance Records
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
