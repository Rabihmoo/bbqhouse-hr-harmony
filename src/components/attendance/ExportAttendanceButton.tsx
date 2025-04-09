
import React from 'react';
import { FileDown, FileSpreadsheet, FilePdf } from "lucide-react";
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
import * as XLSX from "xlsx";
import { generateEmployeeDeclarationPdf } from "@/utils/attendance/pdf/generatePdfDeclaration";
import { jsPDF } from "jspdf";

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
    
    // Group records by employee
    const employeeGroups: Record<string, AttendanceRecord[]> = {};
    filteredDailyRecords.forEach((record) => {
      if (!employeeGroups[record.employeeId]) {
        employeeGroups[record.employeeId] = [];
      }
      employeeGroups[record.employeeId].push(record);
    });
    
    if (type === 'csv') {
      // Export combined CSV
      exportToCsv(exportData, fileName);
      
      // Export individual employee CSVs
      Object.entries(employeeGroups).forEach(([employeeId, records]) => {
        const employeeName = records[0].employeeName.replace(/\s+/g, '_');
        const individualFileName = `${employeeName}_${format(selectedDate, 'yyyy-MM-dd')}`;
        exportToCsv(prepareAttendanceDataForExport(records), individualFileName, employeeId);
      });
      
      toast.success("Attendance data exported as CSV");
    } else {
      // Export combined Excel
      exportToExcel(exportData, fileName);
      
      // Export individual employee Excel files
      Object.entries(employeeGroups).forEach(([employeeId, records]) => {
        const employeeName = records[0].employeeName.replace(/\s+/g, '_');
        const individualFileName = `${employeeName}_${format(selectedDate, 'yyyy-MM-dd')}`;
        exportToExcel(prepareAttendanceDataForExport(records), individualFileName, employeeId);
      });
      
      toast.success("Attendance data exported as Excel");
    }
  };
  
  const handleExportPdf = () => {
    // Group records by employee
    const employeeGroups: Record<string, AttendanceRecord[]> = {};
    filteredDailyRecords.forEach((record) => {
      if (!employeeGroups[record.employeeId]) {
        employeeGroups[record.employeeId] = [];
      }
      employeeGroups[record.employeeId].push(record);
    });
    
    // Generate and download a PDF for each employee
    Object.entries(employeeGroups).forEach(([employeeId, records]) => {
      const employeeName = records[0].employeeName;
      const cleanEmployeeName = employeeName.replace(/\s+/g, '_');
      const fileName = `${cleanEmployeeName}_${format(selectedDate, 'yyyy-MM-dd')}`;
      
      const month = format(selectedDate, 'MMMM');
      const year = format(selectedDate, 'yyyy');
      
      // Create employee report with all required properties
      const employeeReport = {
        employeeName: employeeName,
        employeeId: employeeId,
        biNumber: records[0].biNumber || "N/A", // Using a default if not available
        department: records[0].department || "General",
        company: records[0].company || "Company",
        month: month,
        year: year,
        totalHours: records.reduce((acc, r) => acc + (r.totalHours || 0), 0),
        workingDays: records.length,
        sheetData: prepareAttendanceDataForExport(records).map(item => Object.values(item))
      };
      
      // Generate PDF using jsPDF
      try {
        const pdfDoc = generateEmployeeDeclarationPdf(employeeReport);
        const pdfBlob = pdfDoc.output("blob");
        
        // Create download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Register the export in local storage for tracking
        const exportRecordsStr = localStorage.getItem('bbq-export-records') || '[]';
        const exportRecords = JSON.parse(exportRecordsStr);
        exportRecords.push({
          id: `export-${Date.now()}`,
          timestamp: new Date().toISOString(),
          employeeId: employeeId,
          filename: fileName,
          fileType: 'pdf',
          user: 'current-user'
        });
        localStorage.setItem('bbq-export-records', JSON.stringify(exportRecords));
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("Failed to generate PDF");
      }
    });
    
    toast.success("Attendance exported as PDF");
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
          <FilePdf className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
