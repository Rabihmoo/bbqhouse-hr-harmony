
import * as XLSX from "xlsx";
import { AttendanceReport } from "./types";
import { ExportOptions } from "@/hooks/use-attendance-uploader";
import { createSimpleDeclarationSheet } from "./excel/simpleDeclarationBuilder";
import { generatePdfForEmployee, generateAndDownloadPdf } from "./pdf/pdfGenerator";
import { registerEmployeeExport } from "./storage/exportStorage";
import { sendDeclarationsViaEmail } from "./email/emailExporter";
import { downloadExcelFile } from "./excelUtils";
import { toast } from "sonner";

// Function to export declarations for all employees
export const exportEmployeeDeclarations = async (
  reportData: AttendanceReport, 
  options: ExportOptions
): Promise<void> => {
  try {
    // Apply filters to employee reports
    let filteredReports = reportData.employeeReports;

    // Filter by department if specified
    if (options.filters.department) {
      const departments = options.filters.department.split(",");
      filteredReports = filteredReports.filter(emp => 
        departments.includes(emp.department)
      );
    }

    // Filter by branch if specified
    if (options.filters.branch) {
      const branches = options.filters.branch.split(",");
      filteredReports = filteredReports.filter(emp => 
        branches.includes(emp.company) || !branches.length
      );
    }

    // Filter by status (active only or all)
    if (options.filters.status === 'active') {
      // This would need to be adapted to your actual data structure
      // For now we'll include all employees since we don't have status info
    }

    // Filter by specific employees if specified
    if (options.filters.employees && options.filters.employees.length > 0) {
      filteredReports = filteredReports.filter(emp => 
        options.filters.employees?.includes(emp.employeeId)
      );
    }

    // Create a workbook for multiple sheets (one per employee)
    const workbook = XLSX.utils.book_new();
    
    // Set workbook properties to help prevent Protected View warnings
    workbook.Props = {
      Title: `Employee Declarations ${reportData.month} ${reportData.year}`,
      Subject: "Employee Work Declarations",
      Author: "BBQ HR System",
      CreatedDate: new Date(),
      Company: "BBQ",
    };
    
    // Process each employee
    for (const employeeReport of filteredReports) {
      // Create the declaration sheet for this employee using the new simpler approach
      const sheet = createSimpleDeclarationSheet(
        employeeReport,
        reportData.month.toUpperCase(),
        reportData.year,
        options.includeSignature
      );
      
      // Add the sheet to the workbook
      const sheetName = employeeReport.employeeName.substring(0, 30).replace(/[*?:[\]\/\\]/g, "");
      XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
      
      // If PDF export is required, generate a separate PDF for this employee
      if (options.format === 'pdf' || options.format === 'both') {
        await generateAndDownloadPdf(employeeReport, reportData.month, reportData.year);
      }
      
      // Register the export in the employee record
      registerEmployeeExport(
        employeeReport, 
        reportData.month, 
        reportData.year, 
        options.format
      );
    }
    
    // Generate Excel file for all employees
    if (options.format === 'excel' || options.format === 'both') {
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'array',
        bookSST: false,
        compression: true
      });
      
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Create download link for Excel
      downloadExcelFile(blob, `Employee_Declarations_${reportData.month}_${reportData.year}.xlsx`);
    }
    
    // If email delivery is enabled, send email with attachments
    if (options.sendEmail && options.emailAddress) {
      await sendDeclarationsViaEmail(
        options.emailAddress,
        reportData,
        filteredReports,
        options.format
      );
    }
    
    toast.success("Export completed successfully!");
  } catch (error) {
    console.error("Export failed:", error);
    toast.error("Failed to export declarations");
  }
};

// Export other functions
export { createSimpleDeclarationSheet } from "./excel/simpleDeclarationBuilder";
export { generatePdfForEmployee } from "./pdf/pdfGenerator";
export { registerEmployeeExport } from "./storage/exportStorage";
export { sendDeclarationsViaEmail } from "./email/emailExporter";
