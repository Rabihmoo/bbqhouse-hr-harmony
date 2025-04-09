
import { jsPDF } from "jspdf";
import { EmployeeReport } from "../types";
import { getFormattedSignatureDate } from "../declarationGenerator";

/**
 * Renders attendance table headers
 */
export const renderTableHeaders = (doc: jsPDF, startY: number): number => {
  const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
  const columnWidths = [45, 25, 25, 25, 30, 30];
  const totalWidth = columnWidths.reduce((sum, w) => sum + w, 0);

  doc.setFillColor(238, 238, 238);
  doc.setDrawColor(0);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  let y = startY;
  let x = 10;

  headers.forEach((header, i) => {
    doc.rect(x, y, columnWidths[i], 8, "FD");
    doc.text(header, x + columnWidths[i] / 2, y + 5, { align: "center" });
    x += columnWidths[i];
  });

  return y + 8;
};

/**
 * Renders attendance data rows
 */
export const renderTableRows = (doc: jsPDF, sheetData: any[][], startY: number): number => {
  const columnWidths = [45, 25, 25, 25, 30, 30];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  let y = startY;

  const dataRows = sheetData.slice(2).filter(row => row.length > 0 && row[0] !== "");

  dataRows.forEach(row => {
    let x = 10;
    const isFolga = row[2] === "FOLGA";

    row.forEach((cell, cellIndex) => {
      let cellText = cell.toString();

      if (cellIndex === 4 || cellIndex === 5) {
        if (typeof cell === 'number') {
          const totalMinutes = Math.round(cell * 24 * 60);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          cellText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
      }

      if (isFolga && cellIndex === 2) {
        doc.setDrawColor(0);
        doc.setLineWidth(0.2);
        doc.rect(x, y, columnWidths[2] + columnWidths[3], 5); // Reduced row height
        doc.text("FOLGA", x + (columnWidths[2] + columnWidths[3]) / 2, y + 3, {
          align: "center",
          baseline: "middle"
        });
        x += columnWidths[2] + columnWidths[3];
        return;
      }

      if (isFolga && cellIndex === 3) return;

      doc.rect(x, y, columnWidths[cellIndex], 5); // Reduced row height
      doc.text(cellText, x + columnWidths[cellIndex] / 2, y + 3, {
        align: "center"
      });
      x += columnWidths[cellIndex];
    });

    y += 5; // Reduced row height
  });

  return y;
};

/**
 * Adds total hours and working days summary directly after the table
 */
export const addTotalsSummary = (doc: jsPDF, employeeReport: EmployeeReport, startY: number): number => {
  let y = startY + 2; // Reduced spacing
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text("TOTAL WORKING HOURS", 10, y + 4);
  const totalHours = Math.floor(employeeReport.totalHours);
  const totalMinutes = Math.round((employeeReport.totalHours - totalHours) * 60);
  const formattedTotalTime = `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`;
  let x = 130;
  doc.rect(x, y, 30, 7);
  doc.text(formattedTotalTime, x + 15, y + 4, { align: "center" });

  y += 8;
  doc.text("WORKING DAYS", 10, y + 4);
  const workingDays = employeeReport.workingDays.toString();
  x = 130;
  doc.rect(x, y, 30, 7);
  doc.text(workingDays, x + 15, y + 4, { align: "center" });

  return y + 8;
};

/**
 * Adds the signature section with confirmation text and signature lines
 */
export const addSignatureBlock = (doc: jsPDF, startY: number) => {
  const columnWidths = [45, 25, 25, 25, 30, 30];
  const totalWidth = columnWidths.reduce((sum, w) => sum + w, 0);
  
  let y = startY + 4; // Add some space after totals
  
  // Confirmation text in merged cell with proper wrapping
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
  
  // Create rectangle for confirmation text (merged cell across all columns)
  doc.rect(10, y, totalWidth, 10);
  
  const confirmationText = "Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.";
  
  // Add centered text with wrapping
  doc.text(confirmationText, 10 + totalWidth/2, y + 5, {
    align: "center",
    maxWidth: totalWidth - 4
  });
  
  y += 12; // Move down for signature line
  
  // Signature line (merged A-C)
  const signatureWidth = columnWidths[0] + columnWidths[1] + columnWidths[2];
  doc.rect(10, y, signatureWidth, 8);
  doc.text("Assinatura do Funcionário: _______________________________", 10 + signatureWidth/2, y + 4, { 
    align: "center" 
  });
  
  // Date line (merged E-F)
  const dateX = 10 + signatureWidth + columnWidths[3];
  const dateWidth = columnWidths[4] + columnWidths[5];
  doc.rect(dateX, y, dateWidth, 8);
  doc.text(`Data: ${getFormattedSignatureDate()}`, dateX + dateWidth/2, y + 4, { 
    align: "center" 
  });
};
