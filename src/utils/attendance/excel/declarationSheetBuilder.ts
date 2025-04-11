
import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import { generateDeclarationText, generateSignatureText, getFormattedSignatureDate } from "../declarationGenerator";
import { convertTimeStringToExcelTime, ensureTimeFormatting } from "./timeConversionUtils";
import { setColumnWidths, setRowHeights, setMergedCells, applyTimeFormatting, applyFormattingToAllCells, addAutoFilter } from "./worksheetFormatUtils";
import { applyCellTextFormatting, applyCellBorders, applyCellFont, applyCellFill, applyParagraphFormatting, applyFolgaCellFormatting } from "./cellFormatUtils";

/**
 * Creates a single employee declaration sheet with proper formatting
 */
export const createEmployeeDeclarationSheet = (
  employeeReport: EmployeeReport,
  month: string,
  year: string,
  includeSignature: boolean
): XLSX.WorkSheet => {
  // Create base worksheet
  const ws = XLSX.utils.aoa_to_sheet([[""]]);
  
  // Define important row indices
  const declarationRow = 0;
  const spacerRow = 1;
  const headerRow = 2;
  const dataStartRow = 3;
  const dataEndRow = dataStartRow + employeeReport.attendanceRecords.length - 1;
  const totalsRow = dataEndRow + 1;
  const workingDaysRow = totalsRow + 1;
  const signatureTextRow = includeSignature ? workingDaysRow + 2 : -1;
  const signatureLineRow = includeSignature ? signatureTextRow + 1 : -1;
  
  // Generate declaration title and text
  const declarationTitle = "DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS";
  const declarationText = generateDeclarationText(
    employeeReport.employeeName,
    employeeReport.biNumber || "",
    employeeReport.company,
    month,
    year
  );
  const fullText = `${declarationTitle}\n\n${declarationText}`;
  
  // Set declaration text in cell A1 with enhanced wrapping
  ws["A1"] = { t: 's', v: fullText };
  applyParagraphFormatting(ws, "A1", fullText, {
    fontSize: 12,
    alignment: 'center',
    bold: true
  });
  
  // Add headers row in row 3
  const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
  for (let i = 0; i < headers.length; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: i });
    ws[cellAddress] = { t: 's', v: headers[i] };
    
    // Apply header formatting
    applyCellFont(ws, cellAddress, { bold: true });
    applyCellTextFormatting(ws, cellAddress, { 
      horizontal: 'center',
      vertical: 'center'
    });
    applyCellBorders(ws, cellAddress, 'thin');
  }
  
  // Collect all FOLGA cell merges for later use
  const merges = [];
  
  // Add employee attendance records
  employeeReport.attendanceRecords.forEach((record, index) => {
    const rowIndex = dataStartRow + index;
    
    // Employee name
    ws[XLSX.utils.encode_cell({ r: rowIndex, c: 0 })] = { 
      t: 's', 
      v: employeeReport.employeeName 
    };
    
    // Date
    ws[XLSX.utils.encode_cell({ r: rowIndex, c: 1 })] = { 
      t: 's', 
      v: record.date 
    };
    
    // Handle FOLGA status specially with merged cells
    if (record.status === "FOLGA" || record.clockIn === "FOLGA") {
      // Set FOLGA in Clock In cell and apply special formatting
      const folgaCell = XLSX.utils.encode_cell({ r: rowIndex, c: 2 });
      ws[folgaCell] = { t: 's', v: "FOLGA" };
      applyFolgaCellFormatting(ws, folgaCell);
      
      // Set empty for Clock Out cell since it will be merged
      ws[XLSX.utils.encode_cell({ r: rowIndex, c: 3 })] = { t: 's', v: "" };
      
      // Add this merge to our collection
      merges.push({
        s: { r: rowIndex, c: 2 },  // Clock In cell
        e: { r: rowIndex, c: 3 }   // Clock Out cell
      });
      
      // Set zeros for work and extra hours
      ws[XLSX.utils.encode_cell({ r: rowIndex, c: 4 })] = { t: 's', v: "00:00" };
      ws[XLSX.utils.encode_cell({ r: rowIndex, c: 5 })] = { t: 's', v: "00:00" };
    } else {
      // Normal day - set all values
      ws[XLSX.utils.encode_cell({ r: rowIndex, c: 2 })] = { 
        t: 's', 
        v: record.clockIn || "" 
      };
      
      ws[XLSX.utils.encode_cell({ r: rowIndex, c: 3 })] = { 
        t: 's', 
        v: record.clockOut || "" 
      };
      
      ws[XLSX.utils.encode_cell({ r: rowIndex, c: 4 })] = { 
        t: 's', 
        v: record.workTime || "00:00"
      };
      
      ws[XLSX.utils.encode_cell({ r: rowIndex, c: 5 })] = { 
        t: 's', 
        v: record.extraHours || "00:00" 
      };
    }
    
    // Apply border and center alignment to all cells in the row
    for (let c = 0; c < 6; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c });
      applyCellBorders(ws, cellAddress, 'thin');
      applyCellTextFormatting(ws, cellAddress, { 
        horizontal: 'center',
        vertical: 'center'
      });
    }
  });
  
  // Add totals row with proper formatting and alignment
  // "TOTAL WORKING HOURS" label in the first cell
  const totalLabelCell = XLSX.utils.encode_cell({ r: totalsRow, c: 0 });
  ws[totalLabelCell] = { t: 's', v: "TOTAL WORKING HOURS" };
  applyCellFont(ws, totalLabelCell, { bold: true });
  
  // Empty cells for columns B-D
  for (let c = 1; c <= 3; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: totalsRow, c });
    ws[cellAddress] = { t: 's', v: "" };
  }
  
  // Total hours values
  const totalHoursCell = XLSX.utils.encode_cell({ r: totalsRow, c: 4 });
  ws[totalHoursCell] = { t: 's', v: employeeReport.totalHours || "00:00" };
  applyCellFont(ws, totalHoursCell, { bold: true });
  
  const totalExtraHoursCell = XLSX.utils.encode_cell({ r: totalsRow, c: 5 });
  ws[totalExtraHoursCell] = { 
    t: 's', 
    v: employeeReport.totalExtraHours || employeeReport.extraHours || "00:00" 
  };
  applyCellFont(ws, totalExtraHoursCell, { bold: true });
  
  // Apply borders to all cells in totals row
  for (let c = 0; c < 6; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: totalsRow, c });
    applyCellBorders(ws, cellAddress, 'thin');
    applyCellTextFormatting(ws, cellAddress, { 
      horizontal: 'center',
      vertical: 'center'
    });
  }
  
  // Add working days row with proper formatting
  const workingDaysLabelCell = XLSX.utils.encode_cell({ r: workingDaysRow, c: 0 });
  ws[workingDaysLabelCell] = { t: 's', v: "WORKING DAYS" };
  applyCellFont(ws, workingDaysLabelCell, { bold: true });
  
  // Empty cells for columns B-D
  for (let c = 1; c <= 3; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: workingDaysRow, c });
    ws[cellAddress] = { t: 's', v: "" };
  }
  
  // Working days value
  const workingDaysCell = XLSX.utils.encode_cell({ r: workingDaysRow, c: 4 });
  ws[workingDaysCell] = { t: 'n', v: employeeReport.workingDays };
  applyCellFont(ws, workingDaysCell, { bold: true });
  
  // Empty cell for column F
  const emptyExtraCell = XLSX.utils.encode_cell({ r: workingDaysRow, c: 5 });
  ws[emptyExtraCell] = { t: 's', v: "" };
  
  // Apply borders to all cells in working days row
  for (let c = 0; c < 6; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: workingDaysRow, c });
    applyCellBorders(ws, cellAddress, 'thin');
    applyCellTextFormatting(ws, cellAddress, { 
      horizontal: 'center',
      vertical: 'center'
    });
  }
  
  // Add signature section if needed
  if (includeSignature) {
    // Empty row before signature
    for (let c = 0; c < 6; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r: workingDaysRow + 1, c });
      ws[cellAddress] = { t: 's', v: "" };
    }
    
    // Signature text
    const signatureText = "Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.";
    const signatureTextCell = XLSX.utils.encode_cell({ r: signatureTextRow, c: 0 });
    ws[signatureTextCell] = { t: 's', v: signatureText };
    applyParagraphFormatting(ws, signatureTextCell, signatureText, {
      alignment: 'left'
    });
    
    // Empty cells for columns B-F in signature text row
    for (let c = 1; c < 6; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r: signatureTextRow, c });
      ws[cellAddress] = { t: 's', v: "" };
    }
    
    // Signature line row
    const employeeSignatureCell = XLSX.utils.encode_cell({ r: signatureLineRow, c: 0 });
    ws[employeeSignatureCell] = { t: 's', v: "Employee Signature:" };
    applyCellFont(ws, employeeSignatureCell, { bold: true });
    
    // Empty cells for columns B-D
    for (let c = 1; c <= 3; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r: signatureLineRow, c });
      ws[cellAddress] = { t: 's', v: "" };
    }
    
    // Date cell
    const formattedDate = getFormattedSignatureDate();
    const dateCell = XLSX.utils.encode_cell({ r: signatureLineRow, c: 4 });
    ws[dateCell] = { t: 's', v: `Date: ${formattedDate}` };
    applyCellFont(ws, dateCell, { bold: true });
    
    // Empty cell for column F
    const emptySigCell = XLSX.utils.encode_cell({ r: signatureLineRow, c: 5 });
    ws[emptySigCell] = { t: 's', v: "" };
  }
  
  // ===== APPLY COMPREHENSIVE FORMATTING =====
  
  // Set column widths (Name, Date, Clock In, Clock Out, Work Time, Extra Hours)
  setColumnWidths(ws, [30, 12, 10, 10, 12, 12]);
  
  // Set row heights
  const rowHeights: { [key: number]: number } = {
    [declarationRow]: 150,  // Declaration title and text
    [spacerRow]: 20,        // Spacer row
    [headerRow]: 25,        // Headers
  };
  
  // Standard height for data rows
  for (let i = dataStartRow; i <= dataEndRow; i++) {
    rowHeights[i] = 20;
  }
  
  // Heights for special rows
  rowHeights[totalsRow] = 25;
  rowHeights[workingDaysRow] = 25;
  
  if (includeSignature) {
    rowHeights[workingDaysRow + 1] = 20;   // Empty row
    rowHeights[signatureTextRow] = 40;     // Signature text
    rowHeights[signatureLineRow] = 30;     // Signature line
  }
  
  setRowHeights(ws, rowHeights);
  
  // Add the standard merges
  merges.push(
    // Declaration text across all columns
    { s: { r: declarationRow, c: 0 }, e: { r: declarationRow, c: 5 } },
    
    // Totals label across four columns
    { s: { r: totalsRow, c: 0 }, e: { r: totalsRow, c: 3 } },
    
    // Working days label across four columns
    { s: { r: workingDaysRow, c: 0 }, e: { r: workingDaysRow, c: 3 } }
  );
  
  // Add signature merges if needed
  if (includeSignature) {
    // Signature text across all columns
    merges.push({ 
      s: { r: signatureTextRow, c: 0 }, 
      e: { r: signatureTextRow, c: 5 } 
    });
    
    // Employee signature cells
    merges.push({ 
      s: { r: signatureLineRow, c: 0 }, 
      e: { r: signatureLineRow, c: 3 } 
    });
    
    // Date cell
    merges.push({ 
      s: { r: signatureLineRow, c: 4 }, 
      e: { r: signatureLineRow, c: 5 } 
    });
  }
  
  // Set all merges
  setMergedCells(ws, merges);
  
  // Set the worksheet reference range
  const lastRow = includeSignature ? signatureLineRow : workingDaysRow;
  ws['!ref'] = XLSX.utils.encode_range(
    { r: 0, c: 0 },
    { r: lastRow, c: 5 }
  );
  
  // Fix for the ProtectInfo type error - use only valid properties defined in the ProtectInfo interface
  ws['!protect'] = {
    // Note: The 'sheet' property is not valid for ProtectInfo
    // Instead, use only the valid properties:
    password: '',           // No password protection
    objects: false,         // Don't protect objects
    scenarios: false,       // Don't protect scenarios
    formatCells: false,     // Allow formatting cells
    formatColumns: false,   // Allow formatting columns
    formatRows: false,      // Allow formatting rows
    insertColumns: false,   // Allow inserting columns
    insertRows: false,      // Allow inserting rows
    insertHyperlinks: false,// Allow inserting hyperlinks
    deleteColumns: false,   // Allow deleting columns
    deleteRows: false,      // Allow deleting rows
    selectLockedCells: true,// Allow selecting locked cells
    sort: false,            // Allow sorting
    autoFilter: false,      // Allow auto filter
    pivotTables: false,     // Allow pivot tables
    selectUnlockedCells: true // Allow selecting unlocked cells
  };
  
  return ws;
};
