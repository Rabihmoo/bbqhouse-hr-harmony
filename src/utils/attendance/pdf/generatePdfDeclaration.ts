import { jsPDF } from "jspdf";
import {
  renderTableHeaders,
  renderTableRows,
  addTotalsSummary,
  addSignatureBlock
} from "./pdfRenderer"; // path might need adjusting
import { convertWorkbookToData } from "./pdfExport";
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

  let startY = 20;
  startY = renderTableHeaders(doc, startY);
  startY = renderTableRows(doc, sheetData, startY);
  startY = addTotalsSummary(doc, employeeReport, startY);
  addSignatureBlock(doc, startY); // ✅ Only once!

  return doc;
};
