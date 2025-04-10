import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import {
  generateDeclarationText,
  generateSignatureText,
  getFormattedSignatureDate,
} from "../declarationGenerator";
import { convertTimeStringToExcelTime } from "./timeConversionUtils";
import {
  setColumnWidths,
  setRowHeights,
  setMergedCells,
  applyTimeFormatting,
  applyFormattingToAllCells,
  addAutoFilter,
} from "./worksheetFormatUtils";
import { applyCellTextFormatting } from "./cellFormatUtils";
import { createSheetStructure } from "./attendanceDataFormatter";

/**
 * Creates a single employee declaration sheet with proper formatting
 */
export const createEmployeeDeclarationSheet = (
  employeeReport: EmployeeReport,
  month: string,
  year: string,
  includeSignature: boolean
): XLSX.WorkSheet => {
  // Create the full declaration title and text
  const declarationTitle =
    "DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS";
  const declarationText = generateDeclarationText(
    employeeReport.employeeName,
    employeeReport.biNumber,
    employeeReport.company,
    month,
    year
  );

  // Combine title and text for the merged cell
  const fullDeclarationText = `${declarationTitle}\n\n${declarationText}`;

  // Create sheet structure with headers and data
  const {
    rows,
    dataStartRow,
    dataEndRow,
    totalsRow,
    workingDaysRow,
    signatureTextRow,
    signatureLineRow,
    folgaRows,
  } = createSheetStructure(employeeReport, month, year, fullDeclarationText);

  // Create worksheet from rows
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Apply formatting to worksheet
  applyDeclarationSheetFormatting(
    ws,
    dataStartRow,
    dataEndRow,
    totalsRow,
    workingDaysRow,
    signatureTextRow,
    signatureLineRow,
    folgaRows
  );

  return ws;
};

/**
 * Applies all necessary formatting to the worksheet
 */
const applyDeclarationSheetFormatting = (
  ws: XLSX.WorkSheet,
  dataStartRow: number,
  dataEndRow: number,
  totalsRow: number,
  workingDaysRow: number,
  signatureTextRow: number,
  signatureLineRow: number,
  folgaRows: number[]
): void => {
  // Set column widths for better readability
  setColumnWidths(ws, [25, 12, 10, 10, 10, 12]);

  // Define row heights
  const rowHeights: { [key: number]: number } = {
    0: 200, // Declaration row height
    [signatureTextRow]: 50,
  };
  setRowHeights(ws, rowHeights);

  // Define merged cells
  const merges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // A1:F1 declaration
    { s: { r: signatureTextRow, c: 0 }, e: { r: signatureTextRow, c: 5 } }, // Signature text
    { s: { r: signatureLineRow, c: 0 }, e: { r: signatureLineRow, c: 3 } }, // Signature line
    { s: { r: signatureLineRow, c: 4 }, e: { r: signatureLineRow, c: 5 } }, // Date line
    { s: { r: totalsRow, c: 0 }, e: { r: totalsRow, c: 3 } }, // Totals
    { s: { r: workingDaysRow, c: 0 }, e: { r: workingDaysRow, c: 3 } }, // Working Days
  ];

  folgaRows.forEach((row) => {
    merges.push({ s: { r: row, c: 2 }, e: { r: row, c: 3 } }); // Merge Clock In/Out for FOLGA
  });

  setMergedCells(ws, merges);

  // Wrap + center declaration cell (A1)
  applyCellTextFormatting(ws, "A1", {
    wrapText: true,
    vertical: "center",
    horizontal: "center",
  });

  // Wrap + center signature confirmation
  applyCellTextFormatting(
    ws,
    XLSX.utils.encode_cell({ r: signatureTextRow, c: 0 }),
    {
      wrapText: true,
      vertical: "center",
      horizontal: "center",
    }
  );

  // Apply formatting to all cells
  applyFormattingToAllCells(ws, {
    headerRow: 2, // Header is at row 3 (0-indexed)
    boldRows: [totalsRow, workingDaysRow],
    applyBorders: true,
    applyWrapText: true,
  });

  // Format time totals as HH:MM
  applyTimeFormatting(
    ws,
    XLSX.utils.encode_cell({ r: totalsRow, c: 4 }),
    XLSX.utils.encode_cell({ r: totalsRow, c: 5 })
  );

  // Add filter
  addAutoFilter(ws, "A3:F3");
};
