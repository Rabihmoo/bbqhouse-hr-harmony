
import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import { generateDeclarationText, generateSignatureText, getFormattedSignatureDate } from "../declarationGenerator";

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
  
  // Format the data with improved layout
  const rows = [];
  
  // Declaration text in a single row (will be merged)
  rows.push([fullDeclarationText]);
  
  // Empty row for spacing
  rows.push(["", "", "", "", "", ""]);
  
  // Table headers
  rows.push(["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"]);
  
  const dataStartRow = 4; // Row index (1-based) where data starts (Row 4 is the first data row after headers)
  
  // Format attendance data
  employeeReport.attendanceRecords.forEach((record) => {
    // Calculate work time and extra hours based on clock values
    let workTime = record.workTime || '00:00';
    let extraHours = record.extraHours || '00:00';
    
    // Special handling for FOLGA
    if (record.clockIn === 'FOLGA' || record.clockOut === 'FOLGA') {
      workTime = '00:00';
      extraHours = '00:00';
    }
    // Handle missing clock values
    else if (!record.clockIn || !record.clockOut) {
      if (!record.clockIn && !record.clockOut) {
        workTime = '00:00';
      } else {
        workTime = '04:30';
      }
      extraHours = '00:00';
    }
    
    rows.push([
      employeeReport.employeeName,
      record.date,
      record.clockIn || '',
      record.clockOut || '',
      // Convert work time to proper time format using Excel's internal time representation
      { v: convertTimeStringToExcelTime(workTime), t: 'n', z: '[h]:mm' },
      // Convert extra hours to proper time format
      { v: convertTimeStringToExcelTime(extraHours), t: 'n', z: '[h]:mm' }
    ]);
  });
  
  const dataEndRow = dataStartRow + employeeReport.attendanceRecords.length - 1;
  const workTimeCol = 'E'; // Column E is Work Time
  const extraHoursCol = 'F'; // Column F is Extra Hours
  
  // Add empty row for spacing
  rows.push(["", "", "", "", "", ""]);
  
  // Add formulas for totals with proper time formatting
  rows.push([
    "TOTAL WORKING HOURS", 
    "", 
    "", 
    "", 
    { f: `SUM(${workTimeCol}${dataStartRow}:${workTimeCol}${dataEndRow})`, t: 'n', z: '[h]:mm' },
    { f: `SUM(${extraHoursCol}${dataStartRow}:${extraHoursCol}${dataEndRow})`, t: 'n', z: '[h]:mm' }
  ]);
  
  // Add working days with COUNTIF formula
  rows.push([
    "WORKING DAYS", 
    "", 
    "", 
    "", 
    { f: `COUNTIF(${workTimeCol}${dataStartRow}:${workTimeCol}${dataEndRow},">0:00")` },
    ""
  ]);
  
  // Add empty rows for spacing
  rows.push(["", "", "", "", "", ""]);
  rows.push(["", "", "", "", "", ""]);
  
  // Add signature confirmation text - merged across all columns
  rows.push([generateSignatureText()]);
  
  // Add empty row for spacing
  rows.push(["", "", "", "", "", ""]);
  
  // Add signature line
  rows.push([
    `Assinatura do Funcionário: ______________________________`, 
    "", 
    "", 
    "", 
    `Data: ${getFormattedSignatureDate()}`, 
    ""
  ]);
  
  // Create worksheet from rows
  const ws = XLSX.utils.aoa_to_sheet(rows);
  
  // Apply formatting to worksheet
  applyWorksheetFormatting(ws, dataStartRow, dataEndRow);
  
  return ws;
};

/**
 * Convert time string (HH:MM) to Excel time value
 * Excel time is a decimal number between 0 and 1, where 0 is 00:00 and 1 is 24:00
 */
const convertTimeStringToExcelTime = (timeString: string): number => {
  if (!timeString || timeString === '00:00') {
    return 0;
  }
  
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    // Excel time is represented as a fraction of a 24-hour day
    return (hours + minutes / 60) / 24;
  } catch (error) {
    console.error("Error converting time string to Excel time:", error);
    return 0;
  }
};

/**
 * Applies all necessary formatting to the worksheet
 */
const applyWorksheetFormatting = (
  ws: XLSX.WorkSheet, 
  dataStartRow: number,
  dataEndRow: number
): void => {
  // Set column widths for better readability
  ws['!cols'] = [
    { wch: 25 }, // Name
    { wch: 12 }, // Date
    { wch: 10 }, // Clock In
    { wch: 10 }, // Clock Out
    { wch: 10 }, // Work Time
    { wch: 12 }  // EXTRA HOURS
  ];
  
  // Define row indices
  const titleRow = 0;
  const headerRow = 2;
  const totalsRow = dataEndRow + 2;
  const workingDaysRow = dataEndRow + 3;
  const signatureTextRow = dataEndRow + 6;
  const signatureLineRow = dataEndRow + 8;
  
  // Define merged cells - FIX: properly merge cells as requested
  ws['!merges'] = [
    // Declaration text across all columns (A1:F1) - FIXED
    { s: { r: titleRow, c: 0 }, e: { r: titleRow, c: 5 } },
    
    // Signature text across all columns - FIXED
    { s: { r: signatureTextRow, c: 0 }, e: { r: signatureTextRow, c: 5 } },
    
    // Signature line (left portion) - FIXED
    { s: { r: signatureLineRow, c: 0 }, e: { r: signatureLineRow, c: 3 } },
    
    // Date cell (right portion) - FIXED
    { s: { r: signatureLineRow, c: 4 }, e: { r: signatureLineRow, c: 5 } },
    
    // TOTAL WORKING HOURS label
    { s: { r: totalsRow, c: 0 }, e: { r: totalsRow, c: 3 } },
    
    // WORKING DAYS label
    { s: { r: workingDaysRow, c: 0 }, e: { r: workingDaysRow, c: 3 } },
  ];
  
  // Set row heights - FIXED
  if (!ws['!rows']) ws['!rows'] = [];
  ws['!rows'][titleRow] = { hpt: 180 }; // Set height to 180px for declaration text as requested
  ws['!rows'][signatureTextRow] = { hpt: 50 }; // Set height to 50px for signature text as requested
  
  // Set text wrapping and proper height for declaration cell - FIXED
  const declarationCell = XLSX.utils.encode_cell({ r: titleRow, c: 0 });
  if (!ws[declarationCell]) ws[declarationCell] = { t: 's', v: '' };
  if (!ws[declarationCell].s) ws[declarationCell].s = {};
  ws[declarationCell].s.alignment = { 
    wrapText: true, 
    vertical: 'top', 
    horizontal: 'left' 
  };
  
  // Apply text wrapping for signature cell - FIXED
  const signatureCell = XLSX.utils.encode_cell({ r: signatureTextRow, c: 0 });
  if (!ws[signatureCell]) ws[signatureCell] = { t: 's', v: '' };
  if (!ws[signatureCell].s) ws[signatureCell].s = {};
  ws[signatureCell].s.alignment = { 
    wrapText: true, 
    vertical: 'top',
    horizontal: 'left'
  };
  
  // Apply borders and styling to all cells
  const range = XLSX.utils.decode_range(ws['!ref'] || "A1");
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell_address = XLSX.utils.encode_cell({ r, c });
      if (!ws[cell_address]) {
        // Create empty cell if it doesn't exist
        ws[cell_address] = { t: 's', v: '' };
      }
      
      // Add border style to all cells
      if (!ws[cell_address].s) ws[cell_address].s = {};
      ws[cell_address].s.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
      
      // Add bold style to title, header row, and totals
      if (r === headerRow || r === totalsRow || r === workingDaysRow) {
        if (!ws[cell_address].s) ws[cell_address].s = {};
        ws[cell_address].s.font = { bold: true };
      }
      
      // Add background fill to header row
      if (r === headerRow) {
        ws[cell_address].s.fill = { fgColor: { rgb: "EEEEEE" } };
      }
      
      // Ensure proper number formatting for work time and extra hours columns
      if (r >= dataStartRow && r <= dataEndRow) {
        if (c === 4 || c === 5) { // Work Time (E) or Extra Hours (F) columns
          if (!ws[cell_address].z) {
            ws[cell_address].z = '[h]:mm';
          }
        }
      }
    }
  }
  
  // Make sure formula cells use proper time format for SUM results
  const totalHoursCell = XLSX.utils.encode_cell({ r: totalsRow, c: 4 });
  if (ws[totalHoursCell]) {
    ws[totalHoursCell].z = '[h]:mm';
  }
  
  const totalExtraHoursCell = XLSX.utils.encode_cell({ r: totalsRow, c: 5 });
  if (ws[totalExtraHoursCell]) {
    ws[totalExtraHoursCell].z = '[h]:mm';
  }
  
  // Add AutoFilter for the header row
  ws['!autofilter'] = { ref: `A${headerRow+1}:F${headerRow+1}` };
};
