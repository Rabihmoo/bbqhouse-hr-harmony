
import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import { convertTimeStringToExcelTime } from "./timeConversionUtils";

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
    
    formattedRecords.push([
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
  signatureLineRow: number
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
  
  // Add attendance records
  const attendanceRows = formatAttendanceRecords(employeeReport);
  rows.push(...attendanceRows);
  
  const dataEndRow = dataStartRow + attendanceRows.length - 1;
  
  // Add empty row for spacing
  rows.push(["", "", "", "", "", ""]);
  
  // Add formulas for totals
  const totalsRow = dataEndRow + 1;
  const workTimeCol = 'E';
  const extraHoursCol = 'F';
  
  rows.push([
    "TOTAL WORKING HOURS", 
    "", 
    "", 
    "", 
    { f: `SUM(${workTimeCol}${dataStartRow+1}:${workTimeCol}${dataEndRow+1})`, t: 'n', z: '[h]:mm' },
    { f: `SUM(${extraHoursCol}${dataStartRow+1}:${extraHoursCol}${dataEndRow+1})`, t: 'n', z: '[h]:mm' }
  ]);
  
  // Add working days with COUNTIF formula
  const workingDaysRow = totalsRow + 1;
  rows.push([
    "WORKING DAYS", 
    "", 
    "", 
    "", 
    { f: `COUNTIF(${workTimeCol}${dataStartRow+1}:${workTimeCol}${dataEndRow+1},">0:00")` },
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
    signatureLineRow
  };
};

// Helper function to get formatted date for signature
const getFormattedSignatureDate = (): string => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  
  const months = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL',
    'MAIO', 'JUNHO', 'JULHO', 'AGOSTO',
    'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
  ];
  
  const month = months[currentDate.getMonth()];
  
  return `${day} DE ${month}`;
};
