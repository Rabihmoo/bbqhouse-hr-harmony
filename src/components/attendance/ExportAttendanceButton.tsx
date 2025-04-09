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
import { format } from "date-fns";
import { generateEmployeeDeclarationPdf } from "@/utils/attendance/pdf/generatePdfDeclaration";

interface ExportAttendanceButtonProps {
  filteredDailyRecords: AttendanceRecord[];
  selectedDate: Date;
}

export const ExportAttendanceButton = ({
  filteredDailyRecords,
  selectedDate
}: ExportAttendanceButtonProps) => {
  if (filteredDailyRecords.length === 0) return null;

  const handleExportPDF = () => {
    const groupedByEmployee: { [id: string]: AttendanceRecord[] } = {};

    filteredDailyRecords.forEach(record => {
      if (!groupedByEmployee[record.employeeId]) {
        groupedByEmployee[record.employeeId] = [];
      }
      groupedByEmployee[record.employeeId].push(record);
    });

    Object.entries(groupedByEmployee).forEach(([employeeId, records]) => {
      const sheetData = records.map(r => [
        r.employeeName,
        r.date,
        r.clockIn || "NAO ENTRADA",
        r.clockOut || "NAO SAIDA",
        r.totalHours,
        r.extraHours
      ]);

      const report = {
        employeeId,
        employeeName: records[0].employeeName,
        company: records[0].company || "SUA EMPRESA",
        month: format(selectedDate, "MMMM").toUpperCase(),
        year: format(selectedDate, "yyyy"),
        totalHours: records.reduce((sum, r) => sum + (r.totalHours || 0), 0),
        workingDays: records.filter(r => r.totalHours && r.totalHours > 0).length,
        sheetData
      };

      const pdf = generateEmployeeDeclarationPdf(report);
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${report.employeeName.replace(/\s+/g, "_")}_${report.month}_${report.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });

    toast.success("PDF(s) exported and downloaded");
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
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
