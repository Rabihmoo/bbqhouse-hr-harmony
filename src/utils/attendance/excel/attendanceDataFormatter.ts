import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import { convertTimeStringToExcelTime } from "./timeConversionUtils";
import { getFormattedSignatureDate } from "../declarationGenerator";

/**
 * Format attendance records for the declaration sheet
 */
export const formatAttendanceRecords = (
  employeeReport: EmployeeReport
): any[][] => {
  const formattedRecords: any[][] = [];
  
  // Format attendance data
  employeeReport.attendanceRecords.forEach((record) => {
    // Calculate work time and extra hours based on clock values
    let workTime = record.workTime || '00:00';
    let extraHours = record.extraHours || '00:00';
    
    // Check if this is a FOLGA record
    const isFolga = record.clockIn === 'FOLGA' || record.clockOut === 'FOLGA';
    
    // Special handling for FOLGA
    if (isFolga) {
      workTime = '00:00';
      extraHours = '00:00';
      
      // For FOLGA rows, we'll create a special merged cell format in C and D
      formattedRecords.push([
        employeeReport.employeeName,
        record.date,
        {
          v: 'FOLGA',
          t: 's',
          s: {
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            }
          }
        },
        { 
          v: '', 
          t: 's',
          s: {
            border: {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            }
          }
        }, // Empty cell for Clock Out (will be merged with Clock In)
        // Convert work time to proper time format
        { v: convertTimeStringToExcelTime(workTime), t: 'n', z: '[h]:mm' },
        // Convert extra hours to proper time format
        { v: convertTimeStringToExcelTime(extraHours), t: 'n', z: '[h]:mm' }
      ]);
    }
    // Handle missing clock values
    else if (!record.clockIn || !record.clockOut) {
      if (!record.clockIn && !record.clockOut) {
        workTime = '00:00';
      } else {
        workTime = '04:30';
      }
      extraHours = '00:00';
      
      formattedRecords.push([
        employeeReport.employeeName,
        record.date,
        record.clockIn || '',
        record.clockOut || '',
        // Convert work time to proper time format
        { v: convertTimeStringToExcelTime(workTime), t: 'n', z: '[h]:mm' },
        // Convert extra hours to proper time format
        { v: convertTimeStringToExcelTime(extraHours), t: 'n', z: '[h]:mm' }
      ]);
    }
    else {
      // Regular record with both clock in and out
      formattedRecords.push([
        employeeReport.employeeName,
        record.date,
        record.clockIn,
        record.clockOut,
        // Convert work time to proper time format
        { v: convertTimeStringToExcelTime(workTime), t: 'n', z: '[h]:mm' },
        // Convert extra hours to proper time format
        { v: convertTimeStringToExcelTime(extraHours), t: 'n', z: '[h]:mm' }
      ]);
    }
  });
  
  return formattedRecords;
};

/**
 * Create the declaration sheet structure with headers and data
 */
export const createSheetStructure = (
  employeeReport: EmployeeReport,
  month: string,
  year: string,
  declarationText: string
): {
  rows: any[][],
  dataStartRow: number,
  dataEndRow: number,
  totalsRow: number,
  workingDaysRow: number,
  signatureTextRow: number,
  signatureLineRow: number,
  folgaRows: number[]
} => {
  const rows: any[][] = [];
  
  // Declaration text in a single row (will be merged)
  rows.push([declarationText]);
  
  // Empty row for spacing
  rows.push(["", "", "", "", "", ""]);
  
  // Table headers
  rows.push(["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"]);
  
  // Data starts at row 3 (0-indexed) or row 4 (1-indexed)
  const dataStartRow = 3;
  
  // Track rows that have FOLGA to merge cells later
  const folgaRows: number[] = [];
  
  // Add attendance records
  const attendanceRows = formatAttendanceRecords(employeeReport);
  
  // Track which rows have FOLGA for cell merging
  attendanceRows.forEach((row, index) => {
    if (row[2] && typeof row[2] === 'object' && row[2].v === 'FOLGA') {
      folgaRows.push(dataStartRow + index);
    }
  });
  
  rows.push(...attendanceRows);
  
  const dataEndRow = dataStartRow + attendanceRows.length - 1;
  
  // Add empty row for spacing
  rows.push(["", "", "", "", "", ""]);
  
  // Add formulas for totals - Using fixed range E4:E34 as requested
  const totalsRow = dataEndRow + 1;
  
  rows.push([
    "TOTAL WORKING HOURS", 
    "", 
    "", 
    "", 
    { f: `SUM(E4:E34)`, t: 'n', z: '[h]:mm' }, // Fixed range as requested
    { f: `SUM(F4:F34)`, t: 'n', z: '[h]:mm' }  // For consistency
  ]);
  
  // Add working days with COUNTIF formula - Using fixed range E4:E34 as requested
  const workingDaysRow = totalsRow + 1;
  rows.push([
    "WORKING DAYS", 
    "", 
    "", 
    "", 
    { f: `COUNTIF(E4:E34,">0:00")` }, // Fixed range as requested
    ""
  ]);
  
  // Add empty rows for spacing
  rows.push(["", "", "", "", "", ""]);
  rows.push(["", "", "", "", "", ""]);
  
  // Add signature confirmation text
  const signatureTextRow = workingDaysRow + 3;
  rows.push(["Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima."]);
  
  // Add empty row for spacing
  rows.push(["", "", "", "", "", ""]);
  
  // Add signature line
  const signatureLineRow = signatureTextRow + 2;
  rows.push([
    `Assinatura do Funcionário: ______________________________`, 
    "", 
    "", 
    "", 
    `Data: ${getFormattedSignatureDate()}`, 
    ""
  ]);
  
  return {
    rows,
    dataStartRow,
    dataEndRow,
    totalsRow,
    workingDaysRow,
    signatureTextRow,
    signatureLineRow,
    folgaRows
  };
};
