
import { EmployeeReport } from "../types";
import * as XLSX from "xlsx";
import { downloadExcelFile } from "../excelUtils";
import { createEmployeeDeclarationSheet } from "../excel/declarationSheetBuilder";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { ExcelToJSON, downloadPdfFile } from "../excelUtils";

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
    
    // Set title
    doc.setFontSize(14);
    doc.text("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS", 105, 15, { align: "center" });
    
    // Set declaration text
    doc.setFontSize(10);
    doc.text(sheetData[0][0].replace("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS\n\n", ""), 10, 30, { 
      maxWidth: 190, 
      align: "left"
    });
    
    // Create table
    const startY = 70;
    const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
    const columnWidths = [45, 25, 25, 25, 30, 30];
    
    // Headers
    doc.setFillColor(238, 238, 238);
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setFontStyle("bold");
    
    let y = startY;
    let x = 10;
    headers.forEach((header, i) => {
      doc.rect(x, y, columnWidths[i], 10, "FD");
      doc.text(header, x + columnWidths[i] / 2, y + 6, { align: "center" });
      x += columnWidths[i];
    });
    
    // Data rows
    doc.setFontStyle("normal");
    y += 10;
    
    // Get actual data rows (skip headers and empty rows)
    const dataRows = sheetData.slice(2).filter(row => row.length > 0 && row[0] !== "");
    
    dataRows.forEach((row, rowIndex) => {
      if (rowIndex < 20) {  // Limit rows to fit on one page
        x = 10;
        
        // Check for FOLGA special case
        const isFolga = row[2] === "FOLGA";
        
        row.forEach((cell, cellIndex) => {
          // Handle merging for FOLGA
          if (isFolga && cellIndex === 2) {
            // Draw the merged FOLGA cell
            doc.rect(x, y, columnWidths[2] + columnWidths[3], 8);
            doc.text("FOLGA", x + (columnWidths[2] + columnWidths[3]) / 2, y + 5, { align: "center" });
            x += columnWidths[2] + columnWidths[3];
            return;
          }
          
          // Skip the clock out cell for FOLGA rows
          if (isFolga && cellIndex === 3) {
            return;
          }
          
          // Draw normal cell
          doc.rect(x, y, columnWidths[cellIndex], 8);
          doc.text(cell.toString(), x + columnWidths[cellIndex] / 2, y + 5, { align: "center" });
          x += columnWidths[cellIndex];
        });
        
        y += 8;
      }
    });
    
    // Add totals
    y += 5;
    doc.setFontStyle("bold");
    doc.text("TOTAL WORKING HOURS", 10, y + 5);
    
    // Calculate total work time
    const totalWorkTime = employeeReport.totalHours.toString();
    x = 130;
    doc.rect(x, y, 30, 8);
    doc.text(totalWorkTime, x + 15, y + 5, { align: "center" });
    
    // Add working days
    y += 10;
    doc.text("WORKING DAYS", 10, y + 5);
    
    // Calculate working days
    const workingDays = employeeReport.workingDays.toString();
    x = 130;
    doc.rect(x, y, 30, 8);
    doc.text(workingDays, x + 15, y + 5, { align: "center" });
    
    // Add signature text
    y += 20;
    doc.setFontStyle("normal");
    doc.text("Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.", 10, y, { maxWidth: 190 });
    
    // Add signature line
    y += 20;
    doc.text("Assinatura do Funcionário: _______________________________", 10, y);
    doc.text(`Data: ${getFormattedSignatureDate()}`, 150, y);
    
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

// Helper function to get the formatted signature date
function getFormattedSignatureDate(): string {
  const date = new Date();
  const day = date.getDate();
  const monthNames = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
                      "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} DE ${month} DE ${year}`;
}
