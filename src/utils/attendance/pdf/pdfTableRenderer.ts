import { jsPDF } from "jspdf";
import { EmployeeReport } from "../types";
import { getFormattedSignatureDate } from "../utils/declarationGenerators";

/**
 * Renders attendance table headers
 */
export const renderTableHeaders = (doc: jsPDF, startY: number): number => {
  const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
  const columnWidths = [45, 25, 25, 25, 30, 30];

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
        doc.rect(x, y, columnWidths[2] + columnWidths[3], 6);
        doc.text("FOLGA", x + (columnWidths[2] + columnWidths[3]) / 2, y + 3.8, {
          align: "center",
          baseline: "middle"
        });
        x += columnWidths[2] + columnWidths[3];
        return;
      }

      if (isFolga && cellIndex === 3) return;

      doc.rect(x, y, columnWidths[cellIndex], 6);
      doc.text(cellText, x + columnWidths[cellIndex] / 2, y + 4, {
        align: "center"
      });
      x += columnWidths[cellIndex];
    });

    y += 6;
  });

  return y;
};

/**
 * Adds total hours and working days summary directly after the table
 */
export const addTotalsSummary = (doc: jsPDF, employeeReport: EmployeeReport, startY: number): number => {
  let y = startY + 3;
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
 * Adds the final declaration text and signature block
 */
export const addSignatureBlock = (doc: jsPDF, startY: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const boxMargin = 10;
  const boxWidth = pageWidth - 2 * boxMargin;
  let y = startY + 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setDrawColor(0);
  doc.setLineWidth(0.2);

  const confirmationText =
    "Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.";

  doc.rect(boxMargin, y, boxWidth, 14);
  doc.text(confirmationText, boxMargin + 2, y + 9, {
    maxWidth: boxWidth - 4,
    align: "justify"
  });

  y += 22;
  doc.setFontSize(9);
  doc.rect(10, y, 90, 8);
  doc.text("Assinatura do Funcionário: ______________________________", 12, y + 5);
  doc.rect(115, y, 60, 8);
  doc.text(`Data: ${getFormattedSignatureDate()}`, 117, y + 5);
};
