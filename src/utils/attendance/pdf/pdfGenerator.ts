
import { EmployeeReport } from "../types";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { downloadPdfFile } from "../excelUtils";
import { convertEmployeeReportToPdf } from "./excelToPdfConverter";

/**
 * Generates PDF for a single employee
 */
export const generatePdfForEmployee = async (
  employeeReport: EmployeeReport, 
  month: string, 
  year: string
): Promise<Blob> => {
  try {
    // Convert employee report to PDF document
    const doc = await convertEmployeeReportToPdf(employeeReport, month, year);
    
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
