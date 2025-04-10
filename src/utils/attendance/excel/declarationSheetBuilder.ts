import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import {
  generateDeclarationText,
  generateSignatureText,
  getFormattedSignatureDate
} from "../declarationGenerator";
import { convertTimeStringToExcelTime } from "./timeConversionUtils";
import {
  setColumnWidths,
  setRowHeights,
  setMergedCells,
  applyTimeFormatting,
  applyFormattingToAllCells,
  addAutoFilter
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
  const declarationTitle = "DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS";
  const declarationText = generateDeclarationText(
    employeeReport.employeeName,
    employeeReport.biNumber,
    employeeReport.company,
    month,
    year
  );

  const fullDeclarationText = `${declarationTitle}\n\n${declarationText}`;

  const {
    rows,
    dataStartRow,
    dataEndRow,
    totalsRow,
    workingDaysRow,
    signatureTextRow,
    signatureLineRow,
    folgaRows
  } = createSheetStructure(employeeReport, month, year, fullDeclarationText);

  const ws = XLSX.utils.aoa_to_sheet(rows);

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
  // Expanded column widths for readability
  setColumnWidths(ws, [30, 15, 15, 15, 15, 20]);

  // Increase row height for declaration text
  const rowHeights: { [key: number]: number } = {
    0: 360 // Extra space for wrapped title + paragraph
  };

  rowHeights[signatureTextRow] = 50;

  setRowHeights(ws, rowHeights);

  const merges = [
    // Declaration title + text
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    // Signature explanation text
    { s: { r: signatureTextRow, c: 0 }, e: { r: signatureTextRow, c: 5 } },
    // Signature line
    { s: { r: signatureLineRow, c: 0 }, e: { r: signatureLineRow, c: 3 } },
    // Date line
    { s: { r: signatureLineRow, c: 4 }, e: { r: signatureLineRow, c: 5 } },
    // Totals
    { s: { r: totalsRow, c: 0 }, e: { r: totalsRow, c: 3 } },
    // Working days
    { s: { r: workingDaysRow, c: 0 }, e: { r: workingDaysRow, c: 3 } }
  ];

  // Merge FOLGA cells (Clock In and Clock Out)
  folgaRows.forEach(row => {
    merges.push({ s: { r: row, c: 2 }, e: { r: row, c: 3 } });
  });

  setMergedCells(ws, merges);

  // Format declaration paragraph cell
  applyCellTextFormatting(ws, 'A1', {
    wrapText: true,
    vertical: 'center',
    horizontal: 'center'
  });

  // Format signature text cell
  applyCellTextFormatting(ws, XLSX.utils.encode_cell({ r: signatureTextRow, c: 0 }), {
    wrapText: true,
    vertical: 'center',
    horizontal: 'center'
  });

  // General formatting
  applyFormattingToAllCells(ws, {
    headerRow: 2, // Zero-indexed row 3
    boldRows: [totalsRow, workingDaysRow],
    applyBorders: true,
    applyWrapText: true
  });

  // Format time totals
  applyTimeFormatting(
    ws,
    XLSX.utils.encode_cell({ r: totalsRow, c: 4 }),
    XLSX.utils.encode_cell({ r: totalsRow, c: 5 })
  );

  // Enable filter
  addAutoFilter(ws, `A3:F3`);
};
