
import { EmployeeReport } from "../types";
import * as XLSX from "xlsx";
import { createEmployeeDeclarationSheet } from "../excel/employeeDeclarationBuilder";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { ExcelToJSON, downloadPdfFile } from "../excelUtils";
import { createPdfTable } from "./pdfTableGenerator";
import { addPdfTotals } from "./pdfTotalsGenerator";
import { addPdfSignature } from "./pdfSignatureGenerator";
import { addPdfTitleAndDeclaration } from "./pdfTitleGenerator";

/**
 * Generates PDF for a single employee
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
    
    // Generate PDF using jsPDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Convert Excel to JSON data
    const jsonData = ExcelToJSON(workbook);
    
    // Extract data from first sheet
    const sheetData = jsonData[0].data;
    
    // Add title and declaration text
    addPdfTitleAndDeclaration(doc, sheetData[0][0]);
    
    // Create attendance table
    // Get actual data rows (skip headers and empty rows)
    const dataRows = sheetData.slice(2).filter(row => row.length > 0 && row[0] !== "");
    const tableEndY = createPdfTable(doc, employeeReport, dataRows);
    
    // Add totals section
    const totalsEndY = addPdfTotals(doc, employeeReport, tableEndY);
    
    // Add signature section
    addPdfSignature(doc, totalsEndY);
    
    // Convert to Blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
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
    const fileName = `${employeeReport.employeeName.replace(/\s+/g, "_")}_Declaration_${month}_${year}.pdf`;
    
    // Download the PDF file
    downloadPdfFile(blob, fileName);
    
    toast.success(`PDF Declaration for ${employeeReport.employeeName} downloaded`);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    toast.error("Failed to download declaration");
  }
};
