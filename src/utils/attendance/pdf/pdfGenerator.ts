
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
    
    // Set title with better positioning and styling
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS", 105, 20, { 
      align: "center" 
    });
    
    // Extract declaration text (without the title)
    const declarationText = sheetData[0][0].replace("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS\n\n", "");
    
    // Set declaration text with proper formatting
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(declarationText, 20, 35, { 
      maxWidth: 170,
      align: "justify",
      lineHeightFactor: 1.3
    });
    
    // Determine the height of the text based on content
    const textLines = doc.splitTextToSize(declarationText, 170);
    const textHeight = textLines.length * 5.5; // 5.5mm per line
    
    // Create table with proper positioning after the text
    const startY = 35 + textHeight + 10; // 10mm margin after text
    const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
    const columnWidths = [45, 25, 25, 25, 30, 30];
    
    // Headers
    doc.setFillColor(238, 238, 238);
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    
    let y = startY;
    let x = 20;
    headers.forEach((header, i) => {
      doc.rect(x, y, columnWidths[i], 10, "FD");
      doc.text(header, x + columnWidths[i] / 2, y + 6, { align: "center" });
      x += columnWidths[i];
    });
    
    // Data rows
    doc.setFont("helvetica", "normal");
    y += 10;
    
    // Get actual data rows (skip headers and empty rows)
    const dataRows = sheetData.slice(2).filter(row => row.length > 0 && row[0] !== "");
    
    dataRows.forEach((row, rowIndex) => {
      if (rowIndex < 25) { // Limit rows to fit on one page
        x = 20;
        
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
            doc.rect(x, y, columnWidths[2] + columnWidths[3], 8);
            doc.setFont("helvetica", "bold");
            doc.text("FOLGA", x + (columnWidths[2] + columnWidths[3]) / 2, y + 5, { align: "center" });
            doc.setFont("helvetica", "normal");
            x += columnWidths[2] + columnWidths[3];
            return;
          }
          
          // Skip the clock out cell for FOLGA rows
          if (isFolga && cellIndex === 3) {
            return;
          }
          
          // Draw normal cell
          doc.rect(x, y, columnWidths[cellIndex], 8);
          doc.text(cellText, x + columnWidths[cellIndex] / 2, y + 5, { align: "center" });
          x += columnWidths[cellIndex];
        });
        
        y += 8;
      }
    });
    
    // Add totals with better spacing
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL WORKING HOURS", 20, y + 5);
    
    // Format total work time correctly
    const totalHours = Math.floor(employeeReport.totalHours);
    const totalMinutes = Math.round((employeeReport.totalHours - totalHours) * 60);
    const formattedTotalTime = `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`;
    
    x = 140;
    doc.rect(x, y, 30, 8);
    doc.text(formattedTotalTime, x + 15, y + 5, { align: "center" });
    
    // Add working days
    y += 12;
    doc.text("WORKING DAYS", 20, y + 5);
    
    // Calculate working days
    const workingDays = employeeReport.workingDays.toString();
    x = 140;
    doc.rect(x, y, 30, 8);
    doc.text(workingDays, x + 15, y + 5, { align: "center" });
    
    // Add signature text with better spacing
    y += 20;
    doc.setFont("helvetica", "normal");
    doc.text("Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.", 20, y, { 
      maxWidth: 170,
      align: "justify"
    });
    
    // Add signature line with better positioning
    y += 20;
    doc.text("Assinatura do Funcionário: _______________________________", 20, y);
    doc.text(`Data: ${getFormattedSignatureDate()}`, 140, y);
    
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
