import { jsPDF } from "jspdf";
import { EmployeeReport } from "@/utils/attendance/types";
import { getFormattedSignatureDate } from "@/utils/attendance/declarationGenerator";
import * as XLSX from "xlsx";
import { extractDeclarationText, convertWorkbookToData } from "./excelToPdfConverter";

// Render Table Header
export const renderTableHeaders = (doc: jsPDF, startY: number): number => {
  const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
  const columnWidths = [45, 25, 25, 25, 30, 30];
  doc.setFillColor(238, 238, 238);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  let x = 10;
  headers.forEach((header, i) => {
    doc.rect(x, startY, columnWidths[i], 8, "FD");
    doc.text(header, x + columnWidths[i] / 2, startY + 5, { align: "center" });
    x += columnWidths[i];
  });
  return startY + 8;
};

// Render Table Rows
export const renderTableRows = (doc: jsPDF, sheetData: any[][], startY: number): number => {
  const columnWidths = [45, 25, 25, 25, 30, 30];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  let y = startY;
  const dataRows = sheetData.slice(2).filter(row => row[0] !== "");

  dataRows.forEach(row => {
    let x = 10;
    const isFolga = row[2] === "FOLGA";
    row.forEach((cell, i) => {
      let text = cell.toString();
      if ((i === 4 || i === 5) && typeof cell === 'number') {
        const mins = Math.round(cell * 24 * 60);
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        text = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      }
      if (isFolga && i === 2) {
        doc.rect(x, y, columnWidths[2] + columnWidths[3], 6);
        doc.text("FOLGA", x + (columnWidths[2] + columnWidths[3]) / 2, y + 4, { align: "center" });
        x += columnWidths[2] + columnWidths[3];
        return;
      }
      if (isFolga && i === 3) return;
      doc.rect(x, y, columnWidths[i], 6);
      doc.text(text, x + columnWidths[i] / 2, y + 4, { align: "center" });
      x += columnWidths[i];
    });
    y += 6;
  });

  return y;
};

// Totals Summary
export const addTotalsSummary = (doc: jsPDF, report: EmployeeReport, startY: number): number => {
  let y = startY + 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text("TOTAL WORKING HOURS", 10, y + 4);
  const h = Math.floor(report.totalHours);
  const m = Math.round((report.totalHours - h) * 60);
  const total = `${h}:${m.toString().padStart(2, '0')}`;
  doc.rect(130, y, 30, 7);
  doc.text(total, 145, y + 4, { align: "center" });

  y += 8;
  doc.text("WORKING DAYS", 10, y + 4);
  doc.rect(130, y, 30, 7);
  doc.text(`${report.workingDays}`, 145, y + 4, { align: "center" });

  return y + 8;
};

// Signature Block
export const addSignatureBlock = (doc: jsPDF, startY: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const boxMargin = 10;
  const boxWidth = pageWidth - 20;
  let y = startY + 6;

  const text =
    "Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
  doc.rect(boxMargin, y, boxWidth, 14);
  doc.text(text, boxMargin + 2, y + 9, {
    maxWidth: boxWidth - 4,
    align: "justify"
  });

  y += 22;
  doc.setFontSize(9);
  doc.rect(10, y, 90, 8);
  doc.text("Assinatura do Funcionário: ____________________________", 12, y + 5);
  doc.rect(115, y, 60, 8);
  doc.text(`Data: ${getFormattedSignatureDate()}`, 117, y + 5);
};

// MAIN FUNCTION — PDF GENERATOR
export const generateEmployeeDeclarationPdf = (
  employeeReport: EmployeeReport,
  workbook: XLSX.WorkBook
): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Title
  doc.setFontSize(12);
  doc.text("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS", 105, 12, { align: "center" });

  // Extract data from Excel
  const sheetData = convertWorkbookToData(workbook);

  // Declaration paragraph
  const declarationText = extractDeclarationText(sheetData);
  doc.setFontSize(8);
  doc.text(declarationText, 105, 25, {
    maxWidth: 180,
    align: "center"
  });

  // Render table and sections
  let y = 45;
  y = renderTableHeaders(doc, y);
  y = renderTableRows(doc, sheetData, y);
  y = addTotalsSummary(doc, employeeReport, y);
  addSignatureBlock(doc, y);

  return doc;
};
