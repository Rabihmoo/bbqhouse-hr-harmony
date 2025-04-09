
import { EmployeeReport } from "../types";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { downloadPdfFile } from "../excelUtils";
import { 
  createPdfDocument, 
  addTitle, 
  addDeclarationText,
  addSignatureSection 
} from "./pdfLayout";
import {
  renderTableHeaders,
  renderTableRows,
  addTotalsSummary
} from "./pdfTableRenderer";
import {
  prepareWorkbookFromEmployeeReport,
  convertWorkbookToData,
  extractDeclarationText
} from "./excelToPdfConverter";

/**
 * Generates PDF for a single employee
 */
export const generatePdfForEmployee = async (
  employeeReport: EmployeeReport, 
  month: string, 
  year: string
): Promise<Blob> => {
  try {
    // Prepare Excel workbook
    const workbook = prepareWorkbookFromEmployeeReport(employeeReport, month, year);
    
    // Convert workbook to data array
    const sheetData = convertWorkbookToData(workbook);
    
    // Create PDF document
    const doc = createPdfDocument();
    
    // Add title
    addTitle(doc);
    
    // Extract and add declaration text
    const declarationText = extractDeclarationText(sheetData);
    addDeclarationText(doc, declarationText);
    
    // Adjusted starting Y position for table to start higher on the page
    let y = 50; // Reduced from 70
    
    // Add table with attendance data
    y = renderTableHeaders(doc, y);
    y = renderTableRows(doc, sheetData, y);
    
    // Add totals summary directly after the table rows
    y = addTotalsSummary(doc, employeeReport, y);
    
    // Add signature section with proper spacing
    addSignatureSection(doc, y + 5);
    
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
