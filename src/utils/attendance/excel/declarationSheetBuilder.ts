
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
 * Creates a well-formatted employee declaration sheet with:
 * - Properly formatted declaration paragraph
 * - Correct cell merging and alignment
 * - Consistent styling throughout
 */
export const createEmployeeDeclarationSheet = (
  employeeReport: EmployeeReport,
  month: string,
  year: string,
  includeSignature: boolean
): XLSX.WorkSheet => {
  // 1. Generate the declaration content
  const declarationTitle = "DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS";
  const declarationText = generateDeclarationText(
    employeeReport.employeeName,
    employeeReport.biNumber,
    employeeReport.company,
    month,
    year
  );

  // Combine title and text with proper line breaks
  const fullDeclarationText = `${declarationTitle}\r\n${declarationText}`;

  // 2. Create the sheet structure
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

  // 3. Create worksheet from the 2D array
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // 4. Apply comprehensive formatting
  applyDeclarationSheetFormatting(
    ws,
    dataStartRow,
    dataEndRow,
    totalsRow,
    workingDaysRow,
    signatureTextRow,
    signatureLineRow,
    folgaRows,
    includeSignature
  );

  return ws;
};

/**
 * Applies all formatting to the worksheet with special attention to:
 * - Declaration paragraph formatting (A1)
 * - Consistent cell styling
 * - Proper column widths and row heights
 */
const applyDeclarationSheetFormatting = (
  ws: XLSX.WorkSheet,
  dataStartRow: number,
  dataEndRow: number,
  totalsRow: number,
  workingDaysRow: number,
  signatureTextRow: number,
  signatureLineRow: number,
  folgaRows: number[],
  includeSignature: boolean
): void => {
  // ========== COLUMN WIDTHS ==========
  // Set optimized column widths for better readability
  ws['!cols'] = [
    { wpx: 150 }, // Column A
    { wpx: 80 },  // Column B
    { wpx: 80 },  // Column C
    { wpx: 80 },  // Column D
    { wpx: 80 },  // Column E
    { wpx: 100 }, // Column F
  ];

  // ========== ROW HEIGHTS ==========
  const rowHeights: { [key: number]: number } = {
    0: 200, // Declaration row (A1) - tall enough for wrapped text
    1: 20,  // Empty spacer row
    2: 25,  // Header row
    [signatureTextRow]: 50, // Signature text row
    [signatureLineRow]: 25, // Signature line row
  };

  // Set consistent height for data rows
  for (let i = dataStartRow; i <= dataEndRow; i++) {
    rowHeights[i] = 20;
  }

  ws['!rows'] = Object.keys(rowHeights).map((rowIndex) => ({
    hpx: rowHeights[parseInt(rowIndex)],
  }));

  // ========== MERGED CELLS ==========
  const merges = [
    // Declaration paragraph (A1:F1)
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    // Signature section
    { s: { r: signatureTextRow, c: 0 }, e: { r: signatureTextRow, c: 5 } }, // Text
    { s: { r: signatureLineRow, c: 0 }, e: { r: signatureLineRow, c: 3 } }, // Line
    { s: { r: signatureLineRow, c: 4 }, e: { r: signatureLineRow, c: 5 } }, // Date
    // Summary rows
    { s: { r: totalsRow, c: 0 }, e: { r: totalsRow, c: 3 } },    // Totals label
    { s: { r: workingDaysRow, c: 0 }, e: { r: workingDaysRow, c: 3 } }, // Working days
  ];

  // Merge FOLGA rows
  folgaRows.forEach((row) => {
    merges.push({ s: { r: row, c: 2 }, e: { r: row, c: 3 } }); // Clock In/Out columns
  });

  ws['!merges'] = merges;

  // ========== CELL FORMATTING ==========
  // Format the declaration paragraph (A1)
  const a1Address = XLSX.utils.encode_cell({ r: 0, c: 0 });
  ws[a1Address].s = {
    alignment: {
      wrapText: true,
      vertical: "center",
      horizontal: "center",
      shrinkToFit: false,
    },
    font: {
      name: "Arial",
      sz: 12,
      bold: true, // Bold title in the first line
    },
  };

  // Format signature confirmation text
  if (includeSignature) {
    applyCellTextFormatting(
      ws,
      XLSX.utils.encode_cell({ r: signatureTextRow, c: 0 }),
      {
        wrapText: true,
        vertical: "center",
        horizontal: "center",
        font: { italic: true },
      }
    );
  }

  // Apply consistent formatting to all cells
  applyFormattingToAllCells(ws, {
    headerRow: 2, // Header is at row 3 (0-indexed)
    boldRows: [totalsRow, workingDaysRow],
    applyBorders: true,
    applyWrapText: true,
    baseFont: { name: "Arial", sz: 11 },
  });

  // ========== SPECIAL FORMATTING ==========
  // Format time totals as HH:MM
  applyTimeFormatting(
    ws,
    XLSX.utils.encode_cell({ r: totalsRow, c: 4 }), // Start cell
    XLSX.utils.encode_cell({ r: totalsRow, c: 5 })  // End cell
  );

  // Add filter to header row
  addAutoFilter(ws, "A3:F3");
};

// Removed the duplicate applyCellTextFormatting function that was causing the conflict
