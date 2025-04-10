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

  // Force declaration text to appear in A1
  rows[0][0] = fullDeclarationText;

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
  // Set column widths
  setColumnWidths(ws, [30, 15, 15, 15, 15, 20]);

  // Adjust row height
  const rowHeights: { [key: number]: number } = {
    0: 360,
    [signatureTextRow]: 50
  };

  setRowHeights(ws, rowHeights);

  const merges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    { s: { r: signatureTextRow, c: 0 }, e: { r: signatureTextRow, c: 5 } },
    { s: { r: signatureLineRow, c: 0 }, e: { r: signatureLineRow, c: 3 } },
    { s: { r: signatureLineRow, c: 4 }, e: { r: signatureLineRow, c: 5 } },
    { s: { r: totalsRow, c: 0 }, e: { r: totalsRow, c: 3 } },
    { s: { r: workingDaysRow, c: 0 }, e: { r: workingDaysRow, c: 3 } }
  ];

  folgaRows.forEach(row => {
    merges.push({ s: { r: row, c: 2 }, e: { r: row, c: 3 } });
  });

  setMergedCells(ws, merges);

  // 🟢 APPLY ACTUAL WRAP TO A1
  applyCellTextFormatting(ws, 'A1', {
    wrapText: true,
    vertical: 'center',
    horizontal: 'center'
  });

  // Signature text formatting
  applyCellTextFormatting(ws, XLSX.utils.encode_cell({ r: signatureTextRow, c: 0 }), {
    wrapText: true,
    vertical: 'center',
    horizontal: 'center'
  });

  applyFormattingToAllCells(ws, {
    headerRow: 2,
    boldRows: [totalsRow, workingDaysRow],
    applyBorders: true,
    applyWrapText: true
  });

  applyTimeFormatting(
    ws,
    XLSX.utils.encode_cell({ r: totalsRow, c: 4 }),
    XLSX.utils.encode_cell({ r: totalsRow, c: 5 })
  );

  addAutoFilter(ws, `A3:F3`);
};
