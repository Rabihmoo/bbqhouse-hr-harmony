import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import { generateDeclarationText, getFormattedSignatureDate } from "../declarationGenerator";
import { setColumnWidths, setRowHeights, setMergedCells, applyTimeFormatting, applyFormattingToAllCells, addAutoFilter } from "./worksheetFormatUtils";
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
 * Applies formatting to the declaration worksheet
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
  // ✅ Set wider column widths for better readability
  setColumnWidths(ws, [25, 15, 12, 12, 12, 15]);

  // ✅ Row height: large for paragraph, standard for the rest
  const rowHeights: { [key: number]: number } = {
    0: 240,
    [signatureTextRow]: 50
  };
  setRowHeights(ws, rowHeights);

  // ✅ Merges for key sections
  const merges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // A1:F1
    { s: { r: signatureTextRow, c: 0 }, e: { r: signatureTextRow, c: 5 } },
    { s: { r: signatureLineRow, c: 0 }, e: { r: signatureLineRow, c: 3 } },
    { s: { r: signatureLineRow, c: 4 }, e: { r: signatureLineRow, c: 5 } },
    { s: { r: totalsRow, c: 0 }, e: { r: totalsRow, c: 3 } },
    { s: { r: workingDaysRow, c: 0 }, e: { r: workingDaysRow, c: 3 } }
  ];

  // ✅ Add FOLGA merges
  folgaRows.forEach(row => {
    merges.push({ s: { r: row, c: 2 }, e: { r: row, c: 3 } }); // merge Clock In & Out
  });

  setMergedCells(ws, merges);

  // ✅ Apply wrapped & centered format to the declaration cell
  applyCellTextFormatting(ws, 'A1', {
    wrapText: true,
    vertical: 'center',
    horizontal: 'center'
  });

  // ✅ Apply wrapped & centered format to signature text
  const signatureTextCell = XLSX.utils.encode_cell({ r: signatureTextRow, c: 0 });
  applyCellTextFormatting(ws, signatureTextCell, {
    wrapText: true,
    vertical: 'center',
    horizontal: 'center'
  });

  // ✅ Add borders, bolds, and general formatting
  applyFormattingToAllCells(ws, {
    headerRow: 2,
    boldRows: [totalsRow, workingDaysRow],
    applyBorders: true,
    applyWrapText: true
  });

  // ✅ Fix format of calculated time cells
  applyTimeFormatting(
    ws,
    XLSX.utils.encode_cell({ r: totalsRow, c: 4 }),
    XLSX.utils.encode_cell({ r: totalsRow, c: 5 })
  );

  // ✅ Add Excel filter to table header
  addAutoFilter(ws, `A3:F3`);
};
