
import { jsPDF } from "jspdf";
import {
  renderTableHeaders,
  renderTableRows,
  addTotalsSummary,
  addSignatureBlock
} from "./pdfTableRenderer"; // path might need adjusting
import { convertWorkbookToData } from "./excelToPdfConverter";
import { EmployeeReport } from "../types";
import * as XLSX from "xlsx";

/**
 * Generates the full PDF declaration for a single employee
 */
export const generateEmployeeDeclarationPdf = (
  employeeReport: EmployeeReport,
  workbook: XLSX.WorkBook
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const sheetData = convertWorkbookToData(workbook);

  // Set title
  doc.setFontSize(10); // Smaller font size for title
  doc.setFont("helvetica", "bold");
  doc.text("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS", 105, 10, { align: "center" });
  
  // Add declaration text
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const declarationText = sheetData[0][0].replace("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS\n\n", "");
  doc.text(declarationText, 10, 20, {
    maxWidth: 180,
    align: "justify"
  });
  
  // Start table higher on the page
  let startY = 38; // Start the table higher
  startY = renderTableHeaders(doc, startY);
  startY = renderTableRows(doc, sheetData, startY);
  startY = addTotalsSummary(doc, employeeReport, startY);
  addSignatureBlock(doc, startY); // Add signature section ONCE
  
  return doc;
};
