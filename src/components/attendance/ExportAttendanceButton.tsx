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
    const exportData = prepareAttendanceDataForExport(filteredDailyRecords);
    const fileName = getExportFileName(`Attendance_${format(selectedDate, 'yyyy-MM-dd')}`);

    if (type === 'csv') {
      exportToCsv(exportData, fileName);
      toast.success("CSV exported");
    } else {
      exportToExcel(exportData, fileName);
      toast.success("Excel exported");
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
