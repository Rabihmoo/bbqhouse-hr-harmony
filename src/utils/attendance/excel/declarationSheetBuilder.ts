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
import { applyCellTextFormatting, applyCellFont, applyCellBorders } from "./cellFormatUtils";
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
  const declarationTitle = "DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS";
  const declarationText = generateDeclarationText(
    employeeReport.employeeName,
    employeeReport.biNumber,
    employeeReport.company,
    month,
    year
  );

  // Format with explicit line breaks for better Excel rendering
  // Use \n\n for paragraph breaks to ensure proper spacing
  const formattedDeclarationText = `${declarationTitle}\n\n${declarationText.replace(/\. /g, '.\n')}`;

  // Create sheet structure with headers and data
  const {
    rows,
    dataStartRow,
    dataEndRow,
    totalsRow,
    workingDaysRow,
    signatureTextRow,
    signatureLineRow,
    folgaRows
  } = createSheetStructure(employeeReport, month, year, formattedDeclarationText);

  // Manually add the declaration text into first cell (A1)
  rows[0] = [formattedDeclarationText];

  // Create worksheet from rows
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set proper column widths for readability - increased for better text wrapping
  setColumnWidths(ws, [45, 15, 15, 15, 15, 15]);

  // Define row heights and adjust first row to be tall enough
  const rowHeights: { [key: number]: number } = {
    0: 400, // Increased height for A1 to ensure text visibility
    [signatureTextRow]: 50 // Signature explanation row
  };

  setRowHeights(ws, rowHeights);

  // Define merged cells
  const merges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // A1:F1 Declaration text
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

  // Apply comprehensive formatting to A1 cell after merging
  const a1Address = 'A1';
  
  // Ensure cell A1 exists and has the correct value
  if (!ws[a1Address]) {
    ws[a1Address] = { t: 's', v: formattedDeclarationText };
  }
  
  // Apply formatting to A1 with explicit style properties
  ws[a1Address].s = {
    alignment: {
      wrapText: true,
      vertical: "center",
      horizontal: "center",
      shrinkToFit: false
    },
    font: {
      name: "Arial",
      sz: 11,
      bold: false
    },
    border: {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  // Format signature area
  const signatureCell = XLSX.utils.encode_cell({ r: signatureTextRow, c: 0 });
  applyCellTextFormatting(ws, signatureCell, {
    wrapText: true,
    vertical: 'center',
    horizontal: 'center'
  });
  
  applyCellFont(ws, signatureCell, {
    italic: true
  });

  // Apply borders and basic formatting to all cells
  applyFormattingToAllCells(ws, {
    headerRow: 2,
    boldRows: [totalsRow, workingDaysRow],
    applyBorders: true,
    applyWrapText: true
  });

  // Time format fix for totals
  applyTimeFormatting(
    ws,
    XLSX.utils.encode_cell({ r: totalsRow, c: 4 }),
    XLSX.utils.encode_cell({ r: totalsRow, c: 5 })
  );

  // Add auto filter
  addAutoFilter(ws, `A3:F3`);

  return ws;
};
