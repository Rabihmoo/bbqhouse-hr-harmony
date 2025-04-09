
import { jsPDF } from "jspdf";

/**
 * Sets up the title section of the PDF declaration
 */
export const renderPdfTitle = (doc: jsPDF): void => {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS", 105, 20, { 
    align: "center" 
  });
};

/**
 * Renders the declaration text content with proper formatting
 * Returns the height of the rendered text
 */
export const renderDeclarationText = (doc: jsPDF, declarationText: string): number => {
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(declarationText, 20, 35, { 
    maxWidth: 170,
    align: "justify",
    lineHeightFactor: 1.3
  });
  
  const textLines = doc.splitTextToSize(declarationText, 170);
  const textHeight = textLines.length * 5.5; // 5.5mm per line
  return textHeight;
};

/**
 * Renders the table headers for the attendance records
 */
export const renderTableHeaders = (doc: jsPDF, startY: number): number => {
  const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
  const columnWidths = [45, 25, 25, 25, 30, 30];
  
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
  
  return y + 10; // Return next Y position
};

/**
 * Renders the signature section at the bottom of the PDF
 */
export const renderSignatureSection = (doc: jsPDF, y: number): void => {
  doc.setFont("helvetica", "normal");
  doc.text("Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.", 20, y, { 
    maxWidth: 170,
    align: "justify"
  });
  
  // Add signature line with better positioning
  y += 20;
  doc.text("Assinatura do Funcionário: _______________________________", 20, y);
  doc.text(`Data: ${getFormattedSignatureDate()}`, 140, y);
};

/**
 * Helper function to get the formatted signature date
 */
export const getFormattedSignatureDate = (): string => {
  const date = new Date();
  const day = date.getDate();
  const monthNames = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
                    "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} DE ${month} DE ${year}`;
};

/**
 * Renders totals section with working hours and days summary
 */
export const renderTotalsSection = (doc: jsPDF, y: number, totalHours: number, workingDays: number): number => {
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL WORKING HOURS", 20, y + 5);
  
  // Format total work time correctly
  const totalHoursWhole = Math.floor(totalHours);
  const totalMinutes = Math.round((totalHours - totalHoursWhole) * 60);
  const formattedTotalTime = `${totalHoursWhole}:${totalMinutes.toString().padStart(2, '0')}`;
  
  let x = 140;
  doc.rect(x, y, 30, 8);
  doc.text(formattedTotalTime, x + 15, y + 5, { align: "center" });
  
  // Add working days
  y += 12;
  doc.text("WORKING DAYS", 20, y + 5);
  
  // Display working days count
  x = 140;
  doc.rect(x, y, 30, 8);
  doc.text(workingDays.toString(), x + 15, y + 5, { align: "center" });
  
  return y + 12; // Return the next Y position
};
