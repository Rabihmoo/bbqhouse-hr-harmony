
import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import { generateDeclarationText, generateSignatureText, getFormattedSignatureDate } from "../declarationGenerator";
import { convertTimeStringToExcelTime } from "./timeConversionUtils";
import { setColumnWidths, setRowHeights, setMergedCells, applyTimeFormatting, applyFormattingToAllCells, addAutoFilter } from "./worksheetFormatUtils";
import { applyCellTextFormatting, applyCellBorders, applyCellFont, applyCellFill, applyParagraphFormatting } from "./cellFormatUtils";

/**
 * Creates a single employee declaration sheet with proper formatting
 */
export const createEmployeeDeclarationSheet = (
  employeeReport: EmployeeReport,
  month: string,
  year: string,
  includeSignature: boolean
): XLSX.WorkSheet => {
  // Create data array for the sheet
  const rows = createDeclarationSheetData(employeeReport, month, year, includeSignature);
  
  // Create worksheet from the 2D array
  const ws = XLSX.utils.aoa_to_sheet(rows);
  
  // Format the sheet with proper styling
  formatDeclarationSheet(ws, employeeReport, month, year, includeSignature);
  
  return ws;
};

/**
 * Creates the basic data structure for the declaration sheet
 */
const createDeclarationSheetData = (
  employeeReport: EmployeeReport,
  month: string,
  year: string,
  includeSignature: boolean
): any[][] => {
  // Initialize with empty declaration cell (will be formatted separately)
  const rows: any[][] = [
    [""], // Row 0: Declaration text (A1) - will be formatted separately
    [""], // Row 1: Empty spacer row
  ];
  
  // Add headers row
  rows.push([
    "Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"
  ]);
  
  // Add employee attendance records
  let rowIndex = 3; // Starting from row 4 (0-indexed)
  const folgaRows: number[] = [];
  
  employeeReport.attendanceRecords.forEach(record => {
    const recordRow = [
      employeeReport.employeeName,
      record.date,
      record.clockIn || "",
      record.clockOut || "",
      record.workTime || "",
      record.extraHours || ""
    ];
    
    rows.push(recordRow);
    
    // Track FOLGA rows for special formatting
    if (record.status === "FOLGA") {
      folgaRows.push(rowIndex);
    }
    
    rowIndex++;
  });
  
  // Add totals row
  const totalsRow = [
    "TOTAL WORKING HOURS", "", "", "", 
    employeeReport.totalHours || "0:00", 
    employeeReport.totalExtraHours || employeeReport.extraHours || "0:00"  // Use totalExtraHours with fallback to extraHours
  ];
  rows.push(totalsRow);
  
  // Add working days row
  const workingDaysRow = [
    "WORKING DAYS", "", "", "", 
    employeeReport.workingDays.toString(), 
    ""
  ];
  rows.push(workingDaysRow);
  
  // Add signature section if needed
  if (includeSignature) {
    // Empty row before signature
    rows.push(["", "", "", "", "", ""]);
    
    // Signature text row
    const signatureText = generateSignatureText();
    rows.push([signatureText, "", "", "", "", ""]);
    
    // Signature line row
    const formattedDate = getFormattedSignatureDate();
    rows.push(["Employee Signature:", "", "", "", `Date: ${formattedDate}`, ""]);
  }
  
  return rows;
};

/**
 * Applies comprehensive formatting to the declaration sheet
 */
const formatDeclarationSheet = (
  ws: XLSX.WorkSheet,
  employeeReport: EmployeeReport,
  month: string,
  year: string,
  includeSignature: boolean
): void => {
  // Get the number of data rows and important row indices
  const dataStartRow = 3;
  const dataEndRow = dataStartRow + employeeReport.attendanceRecords.length - 1;
  const totalsRow = dataEndRow + 1;
  const workingDaysRow = totalsRow + 1;
  const signatureTextRow = includeSignature ? workingDaysRow + 2 : -1;
  const signatureLineRow = includeSignature ? signatureTextRow + 1 : -1;
  
  // Get FOLGA rows for special formatting
  const folgaRows: number[] = [];
  employeeReport.attendanceRecords.forEach((record, index) => {
    if (record.status === "FOLGA") {
      folgaRows.push(dataStartRow + index);
    }
  });
  
  // ===== FORMAT THE DECLARATION TEXT (A1) =====
  // Generate the declaration text
  const declarationTitle = "DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS";
  const declarationText = generateDeclarationText(
    employeeReport.employeeName,
    employeeReport.biNumber || "",
    employeeReport.company,
    month,
    year
  );
  
  // Format with explicit line breaks for Excel
  const fullDeclarationText = `${declarationTitle}\n\n${declarationText}`;
  
  // Apply special paragraph formatting to ensure wrapping works
  applyParagraphFormatting(ws, 'A1', fullDeclarationText, {
    fontSize: 12,
    bold: false
  });
  
  // Apply title formatting separately
  const a1Cell = ws['A1'];
  if (a1Cell && a1Cell.v && typeof a1Cell.v === 'string') {
    // Extract and format just the title with bold
    const titleEndsAt = a1Cell.v.indexOf('\n\n');
    if (titleEndsAt > 0) {
      const title = a1Cell.v.substring(0, titleEndsAt);
      // We can't directly format part of the text, but we can make the whole cell bold
      // which is a reasonable compromise
      applyCellFont(ws, 'A1', { bold: true });
    }
  }
  
  // ===== COLUMN WIDTHS =====
  setColumnWidths(ws, [25, 12, 10, 10, 10, 12]);
  
  // ===== ROW HEIGHTS =====
  const rowHeights: { [key: number]: number } = {
    0: 240, // Declaration text row - increased height for better visibility
    1: 20,  // Spacer row
    2: 30,  // Header row
  };
  
  // Standard height for data rows
  for (let i = dataStartRow; i <= dataEndRow; i++) {
    rowHeights[i] = 20;
  }
  
  // Heights for special rows
  rowHeights[totalsRow] = 25;
  rowHeights[workingDaysRow] = 25;
  
  if (includeSignature) {
    rowHeights[signatureTextRow - 1] = 20; // Spacer row
    rowHeights[signatureTextRow] = 60;    // Signature text
    rowHeights[signatureLineRow] = 30;    // Signature line
  }
  
  setRowHeights(ws, rowHeights);
  
  // ===== MERGED CELLS =====
  const merges = [
    // Declaration text across all columns (A1:F1)
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    
    // Total working hours row - merge label cells
    { s: { r: totalsRow, c: 0 }, e: { r: totalsRow, c: 3 } },
    
    // Working days row - merge label cells
    { s: { r: workingDaysRow, c: 0 }, e: { r: workingDaysRow, c: 3 } },
  ];
  
  // Add signature merges if needed
  if (includeSignature) {
    merges.push(
      // Signature text across all columns
      { s: { r: signatureTextRow, c: 0 }, e: { r: signatureTextRow, c: 5 } },
      
      // Employee signature label and line
      { s: { r: signatureLineRow, c: 0 }, e: { r: signatureLineRow, c: 3 } },
      
      // Date field
      { s: { r: signatureLineRow, c: 4 }, e: { r: signatureLineRow, c: 5 } }
    );
  }
  
  // Add merges for FOLGA cells
  folgaRows.forEach(row => {
    merges.push(
      // Merge Clock In/Out cells for FOLGA
      { s: { r: row, c: 2 }, e: { r: row, c: 3 } }
    );
  });
  
  setMergedCells(ws, merges);
  
  // ===== APPLY BORDERS AND BASIC FORMATTING TO ALL CELLS =====
  applyFormattingToAllCells(ws, {
    headerRow: 2,
    boldRows: [totalsRow, workingDaysRow],
    applyBorders: true,
    applyWrapText: true,
    fontName: "Arial",
    fontSize: 11
  });
  
  // ===== SPECIAL FORMATTING =====
  // Format FOLGA cells
  folgaRows.forEach(row => {
    const folgaCell = XLSX.utils.encode_cell({ r: row, c: 2 });
    ws[folgaCell].v = "FOLGA";
    
    // Apply FOLGA cell formatting
    applyFolgaFormatting(ws, folgaCell);
  });
  
  // Format time cells
  applyTimeFormatting(
    ws,
    XLSX.utils.encode_cell({ r: dataStartRow, c: 4 }),
    XLSX.utils.encode_cell({ r: dataEndRow, c: 5 })
  );
  
  // Format totals cell specifically
  applyTimeFormatting(
    ws,
    XLSX.utils.encode_cell({ r: totalsRow, c: 4 }),
    XLSX.utils.encode_cell({ r: totalsRow, c: 5 })
  );
  
  // Format signature text if included
  if (includeSignature) {
    const signatureTextCell = XLSX.utils.encode_cell({ r: signatureTextRow, c: 0 });
    applyParagraphFormatting(ws, signatureTextCell, ws[signatureTextCell].v.toString(), {
      italic: true,
      alignment: 'center'
    });
    
    // Format signature line
    const signatureLineCell = XLSX.utils.encode_cell({ r: signatureLineRow, c: 0 });
    applyCellFont(ws, signatureLineCell, { bold: true });
    
    // Format date cell
    const dateCell = XLSX.utils.encode_cell({ r: signatureLineRow, c: 4 });
    applyCellFont(ws, dateCell, { bold: true });
  }
  
  // Add filter to the header row
  addAutoFilter(ws, "A3:F3");
};

/**
 * Specifically formats FOLGA cells with proper alignment and border
 * This replaces the missing applyFolgaCellFormatting function
 */
const applyFolgaFormatting = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  
  // Ensure strong border is applied
  applyCellBorders(ws, cellAddress, 'thin');
  
  // Center text both horizontally and vertically
  applyCellTextFormatting(ws, cellAddress, {
    wrapText: true,
    horizontal: 'center',
    vertical: 'center'
  });
  
  // Make text bold for emphasis
  applyCellFont(ws, cellAddress, { bold: true });
};
