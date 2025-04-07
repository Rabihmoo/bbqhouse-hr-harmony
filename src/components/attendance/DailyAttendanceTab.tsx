
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { AttendanceRecord } from '@/types/attendance';
import { DateFilter } from './DateFilter';
import { ExportAttendanceButton } from './ExportAttendanceButton';
import { AttendanceTable } from './AttendanceTable';
import { EmptyAttendanceState } from './EmptyAttendanceState';

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
  
  const handleEditRecord = (record: AttendanceRecord) => {
    setNewAttendance({
      employeeId: record.employeeId,
      date: new Date(record.date),
      clockIn: record.clockIn || "08:00",
      clockOut: record.clockOut || "17:00",
      status: record.status,
      notes: record.notes || ""
    });
    setActiveTab("add");
  };

  const handleAddAttendance = () => {
    setActiveTab("add");
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Daily Attendance</CardTitle>
          <CardDescription className="mt-1">
            {format(selectedDate, "MMMM d, yyyy")}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <DateFilter 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          
          <ExportAttendanceButton 
            filteredDailyRecords={filteredDailyRecords}
            selectedDate={selectedDate}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredDailyRecords.length > 0 ? (
          <AttendanceTable 
            filteredDailyRecords={filteredDailyRecords}
            onEditRecord={handleEditRecord}
          />
        ) : (
          <EmptyAttendanceState 
            employeesWithoutAttendance={employeesWithoutAttendance}
            onAddAttendance={handleAddAttendance}
          />
        )}
      </CardContent>
    </Card>
  );
};
