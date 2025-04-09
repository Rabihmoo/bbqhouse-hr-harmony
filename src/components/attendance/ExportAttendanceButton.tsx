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
import { generateEmployeeDeclarationPdf } from "@/utils/attendance/pdf/generatePdfDeclaration";
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

  const handleExportPdf = async () => {
    const employee = filteredDailyRecords[0];
    const employeeReport = {
      employeeName: employee.employeeName,
      biNumber: employee.biNumber || "123456",
      companyName: employee.company || "BBQ HOUSE",
      totalHours: employee.totalHours || 0,
      workingDays: 1,
      dailyData: [employee]
    };

    const month = format(selectedDate, "MMMM").toUpperCase();
    const year = format(selectedDate, "yyyy");

    const pdf = generateEmployeeDeclarationPdf(employeeReport, month, year);
    const blob = pdf.output("blob");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${employee.employeeName}_${month}_${year}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast.success("PDF downloaded");
  };

  const handleExport = (type: 'csv' | 'excel') => {
    const exportData = prepareAttendanceDataForExport(filteredDailyRecords);
    const fileName = getExportFileName(`Attendance_${format(selectedDate, 'yyyy-MM-dd')}`);

    if (type === 'csv') {
      exportToCsv(exportData, fileName);
    } else {
      exportToExcel(exportData, fileName);
    }
    toast.success(`${type.toUpperCase()} downloaded`);
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
        <DropdownMenuItem onClick={handleExportPdf}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
