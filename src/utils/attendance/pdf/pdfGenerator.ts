
import { EmployeeReport } from "../types";
import * as XLSX from "xlsx";
import { downloadExcelFile } from "../excelUtils";
import { createEmployeeDeclarationSheet } from "../excel/declarationSheetBuilder";
import { toast } from "sonner";

/**
 * Generates PDF for a single employee
 * Since we don't have a direct PDF generation library,
 * we'll simulate PDF export by creating an Excel file 
 * that can be printed as PDF.
 */
export const generatePdfForEmployee = async (
  employeeReport: EmployeeReport, 
  month: string, 
  year: string
): Promise<Blob> => {
  try {
    // Create a workbook with a single sheet
    const workbook = XLSX.utils.book_new();
    
    // Create the declaration sheet
    const sheet = createEmployeeDeclarationSheet(
      employeeReport,
      month.toUpperCase(),
      year,
      true // Include signature
    );
    
    // Add the sheet to the workbook
    const sheetName = employeeReport.employeeName.substring(0, 30).replace(/[*?:[\]\/\\]/g, "");
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    
    // Convert to array buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Create Blob
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    return blob;
  } catch (error) {
    console.error("Error generating PDF for employee:", error);
    toast.error(`Failed to generate PDF for ${employeeReport.employeeName}`);
    throw new Error("PDF generation failed");
  }
};

/**
 * Generate PDF for an employee and trigger download
 */
export const generateAndDownloadPdf = async (
  employeeReport: EmployeeReport,
  month: string,
  year: string
): Promise<void> => {
  try {
    const blob = await generatePdfForEmployee(employeeReport, month, year);
    
    // Build filename for the PDF
    const fileName = `${employeeReport.employeeName.replace(/\s+/g, "_")}_Declaration_${month}_${year}.xlsx`;
    
    // Create download link
    downloadExcelFile(blob, fileName);
    
    toast.success(`Declaration for ${employeeReport.employeeName} downloaded`);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    toast.error("Failed to download declaration");
  }
};
