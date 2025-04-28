
import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import { applyCellBorders, applyCellFont, applyCellTextFormatting } from "./formatting";

/**
 * Adds totals and working days rows to the worksheet
 */
export const addTotalsRows = (
  ws: XLSX.WorkSheet,
  employeeReport: EmployeeReport,
  rowIndices: {
    totalsRow: number;
    workingDaysRow: number;
  }
): void => {
  // Add totals row with proper formatting and alignment
  // "TOTAL WORKING HOURS" label in the first cell
  const totalLabelCell = XLSX.utils.encode_cell({ r: rowIndices.totalsRow, c: 0 });
  ws[totalLabelCell] = { t: 's', v: "TOTAL WORKING HOURS" };
  applyCellFont(ws, totalLabelCell, { bold: true });
  
  // Empty cells for columns B-D
  for (let c = 1; c <= 3; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndices.totalsRow, c });
    ws[cellAddress] = { t: 's', v: "" };
  }
  
  // Total hours values
  const totalHoursCell = XLSX.utils.encode_cell({ r: rowIndices.totalsRow, c: 4 });
  ws[totalHoursCell] = { t: 's', v: employeeReport.totalHours || "00:00" };
  applyCellFont(ws, totalHoursCell, { bold: true });
  
  const totalExtraHoursCell = XLSX.utils.encode_cell({ r: rowIndices.totalsRow, c: 5 });
  ws[totalExtraHoursCell] = { 
    t: 's', 
    v: employeeReport.totalExtraHours || employeeReport.extraHours || "00:00" 
  };
  applyCellFont(ws, totalExtraHoursCell, { bold: true });
  
  // Apply borders to all cells in totals row
  for (let c = 0; c < 6; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndices.totalsRow, c });
    applyCellBorders(ws, cellAddress, 'thin');
    applyCellTextFormatting(ws, cellAddress, { 
      horizontal: 'center',
      vertical: 'center'
    });
  }
  
  // Add working days row with proper formatting
  const workingDaysLabelCell = XLSX.utils.encode_cell({ r: rowIndices.workingDaysRow, c: 0 });
  ws[workingDaysLabelCell] = { t: 's', v: "WORKING DAYS" };
  applyCellFont(ws, workingDaysLabelCell, { bold: true });
  
  // Empty cells for columns B-D
  for (let c = 1; c <= 3; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndices.workingDaysRow, c });
    ws[cellAddress] = { t: 's', v: "" };
  }
  
  // Working days value
  const workingDaysCell = XLSX.utils.encode_cell({ r: rowIndices.workingDaysRow, c: 4 });
  ws[workingDaysCell] = { t: 'n', v: employeeReport.workingDays };
  applyCellFont(ws, workingDaysCell, { bold: true });
  
  // Empty cell for column F
  const emptyExtraCell = XLSX.utils.encode_cell({ r: rowIndices.workingDaysRow, c: 5 });
  ws[emptyExtraCell] = { t: 's', v: "" };
  
  // Apply borders to all cells in working days row
  for (let c = 0; c < 6; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndices.workingDaysRow, c });
    applyCellBorders(ws, cellAddress, 'thin');
    applyCellTextFormatting(ws, cellAddress, { 
      horizontal: 'center',
      vertical: 'center'
    });
  }
};
