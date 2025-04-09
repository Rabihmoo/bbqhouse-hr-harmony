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
    
    // Create the declaration sheet - IMPORTANT: Set includeSignature to false
    // This prevents duplication of signature and totals
    const sheet = createEmployeeDeclarationSheet(
      employeeReport,
      month.toUpperCase(),
      year,
      false // Changed to false to prevent duplication
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
    doc.setFontSize(12);
    doc.text("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS", 105, 10, { align: "center" });
    
    // Set declaration text
    doc.setFontSize(8);
    doc.text(sheetData[0][0].replace("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS\n\n", ""), 10, 20, { 
      maxWidth: 190, 
      align: "left"
    });
    
    // Create table
    const startY = 45;
    const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
    const columnWidths = [45, 25, 25, 25, 30, 30];
    
    // Headers
    doc.setFillColor(238, 238, 238);
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    
    let y = startY;
    let x = 10;
    const headerHeight = 7;
    
    headers.forEach((header, i) => {
      doc.rect(x, y, columnWidths[i], headerHeight, "FD");
      doc.text(header, x + columnWidths[i] / 2, y + headerHeight/2, { align: "center" });
      x += columnWidths[i];
    });
    
    // Data rows
    doc.setFont("helvetica", "normal");
    y += headerHeight;
    
    // Get actual data rows (skip headers and empty rows)
    const dataRows = sheetData.slice(2).filter(row => row.length > 0 && row[0] !== "");
    
    // Set row height
    const rowHeight = 5;
    
    // Process all rows without limiting
    dataRows.forEach((row) => {
      x = 10;
      
      // Check for FOLGA special case
      const isFolga = row[2] === "FOLGA";
      
      row.forEach((cell, cellIndex) => {
        // Format time values properly
        let cellText = cell.toString();
        
        // Handle numeric time values
        if (cellIndex === 4 || cellIndex === 5) { // Work Time or Extra Hours column
          if (typeof cell === 'number') {
            // Convert Excel time value to HH:MM format
            const totalMinutes = Math.round(cell * 24 * 60); // Convert to minutes
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            cellText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          }
        }
        
        // Handle merging for FOLGA
        if (isFolga && cellIndex === 2) {
          // Draw the merged FOLGA cell with proper border and centered text
          doc.rect(x, y, columnWidths[2] + columnWidths[3], rowHeight);
          doc.text("FOLGA", x + (columnWidths[2] + columnWidths[3]) / 2, y + rowHeight/2, { align: "center" });
          x += columnWidths[2] + columnWidths[3];
          return;
        }
        
        // Skip the clock out cell for FOLGA rows
        if (isFolga && cellIndex === 3) {
          return;
        }
        
        // Draw normal cell
        doc.rect(x, y, columnWidths[cellIndex], rowHeight);
        doc.text(cellText, x + columnWidths[cellIndex] / 2, y + rowHeight/2, { align: "center" });
        x += columnWidths[cellIndex];
      });
      
      y += rowHeight;
    });
    
    // Add totals - We manually add these after the table
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL WORKING HOURS", 10, y + 4);
    
    // Format total work time correctly
    const totalHours = Math.floor(employeeReport.totalHours);
    const totalMinutes = Math.round((employeeReport.totalHours - totalHours) * 60);
    const formattedTotalTime = `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`;
    
    x = 130;
    doc.rect(x, y, 30, 6);
    doc.text(formattedTotalTime, x + 15, y + 3, { align: "center" });
    
    // Add working days
    y += 7;
    doc.text("WORKING DAYS", 10, y + 4);
    
    // Calculate working days
    const workingDays = employeeReport.workingDays.toString();
    x = 130;
    doc.rect(x, y, 30, 6);
    doc.text(workingDays, x + 15, y + 3, { align: "center" });
    
    // Add signature text
    y += 9;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.", 10, y, { maxWidth: 190 });
    
    // Add signature line
    y += 10;
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