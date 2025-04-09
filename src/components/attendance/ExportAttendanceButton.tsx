import React from 'react';
import { FileDown, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { AttendanceRecord } from '@/types/attendance';
import {
  exportToCsv,
  exportToExcel,
  prepareAttendanceDataForExport,
  getExportFileName
} from '@/utils/exportOperations';
import { format } from "date-fns";

interface ExportAttendanceButtonProps {
  filteredDailyRecords: AttendanceRecord[];
  selectedDate: Date;
}

export const ExportAttendanceButton = ({
  filteredDailyRecords,
  selectedDate
}: ExportAttendanceButtonProps) => {
  if (filteredDailyRecords.length === 0) return null;

  const handleExport = (type: 'csv' | 'excel') => {
    if (filteredDailyRecords.length === 0) {
      toast.error("No data to export");
      return;
    }

    const exportData = prepareAttendanceDataForExport(filteredDailyRecords);
    const fileName = getExportFileName(`Attendance_${format(selectedDate, 'yyyy-MM-dd')}`);

    const employeeGroups: { [key: string]: AttendanceRecord[] } = {};
    filteredDailyRecords.forEach(record => {
      if (!employeeGroups[record.employeeId]) {
        employeeGroups[record.employeeId] = [];
      }
      employeeGroups[record.employeeId].push(record);
    });

    if (type === 'csv') {
      exportToCsv(exportData, fileName);
      Object.entries(employeeGroups).forEach(([employeeId, records]) => {
        const employeeName = records[0].employeeName.replace(/\s+/g, '_');
        const individualFileName = `${employeeName}_${format(selectedDate, 'yyyy-MM-dd')}`;
        exportToCsv(prepareAttendanceDataForExport(records), individualFileName, employeeId);
      });
      toast.success("Attendance data exported as CSV");
    } else {
      exportToExcel(exportData, fileName);
      Object.entries(employeeGroups).forEach(([employeeId, records]) => {
        const employeeName = records[0].employeeName.replace(/\s+/g, '_');
        const individualFileName = `${employeeName}_${format(selectedDate, 'yyyy-MM-dd')}`;
        exportToExcel(prepareAttendanceDataForExport(records), individualFileName, employeeId);
      });
      toast.success("Attendance data exported as Excel");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
