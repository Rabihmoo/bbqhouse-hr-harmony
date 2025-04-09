
import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import { generateDeclarationText, generateSignatureText, getFormattedSignatureDate } from "../declarationGenerator";
import { convertTimeStringToExcelTime } from "./timeConversionUtils";
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
  // Create the full declaration title and text
  const declarationTitle = "DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS";
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
    signatureLineRow
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
    signatureLineRow
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
  signatureLineRow: number
): void => {
  // Set column widths for better readability
  setColumnWidths(ws, [25, 12, 10, 10, 10, 12]);
  
  // Define row heights for declaration and signature text
  const rowHeights: { [rowIndex: number]: number } = {};
  rowHeights[0] = 240; // Title + declaration text row - increased to 240 as requested
  rowHeights[signatureTextRow] = 50; // Signature text row
  
  setRowHeights(ws, rowHeights);
  
  // Define merged cells
  const merges = [
    // Declaration text across all columns (A1:F1)
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    
    // Signature text across all columns (A:F in signature row)
    { s: { r: signatureTextRow, c: 0 }, e: { r: signatureTextRow, c: 5 } },
    
    // Signature line (Employee signature cell - merge A-D)
    { s: { r: signatureLineRow, c: 0 }, e: { r: signatureLineRow, c: 3 } },
    
    // Date cell (merge E-F)
    { s: { r: signatureLineRow, c: 4 }, e: { r: signatureLineRow, c: 5 } },
    
    // TOTAL WORKING HOURS label
    { s: { r: totalsRow, c: 0 }, e: { r: totalsRow, c: 3 } },
    
    // WORKING DAYS label
    { s: { r: workingDaysRow, c: 0 }, e: { r: workingDaysRow, c: 3 } },
  ];
  setMergedCells(ws, merges);
  
  // Apply text wrapping and alignment for declaration cell - added center alignment
  applyCellTextFormatting(ws, 'A1', { 
    wrapText: true, 
    vertical: 'center', 
    horizontal: 'center' 
  });
  
  // Apply text wrapping and alignment for signature text cell - added center alignment
  applyCellTextFormatting(ws, XLSX.utils.encode_cell({ r: signatureTextRow, c: 0 }), { 
    wrapText: true, 
    vertical: 'center',
    horizontal: 'center'
  });
  
  // Apply formatting to all cells (borders, bold headers, etc.)
  applyFormattingToAllCells(ws, {
    headerRow: 2, // Header is at row 3 (0-indexed)
    boldRows: [totalsRow, workingDaysRow],
    applyBorders: true
  });
  
  // Make sure formula cells use proper time format for SUM results
  applyTimeFormatting(
    ws, 
    XLSX.utils.encode_cell({ r: totalsRow, c: 4 }), 
    XLSX.utils.encode_cell({ r: totalsRow, c: 5 })
  );
  
  // Add AutoFilter for the header row
  addAutoFilter(ws, `A3:F3`);
};
