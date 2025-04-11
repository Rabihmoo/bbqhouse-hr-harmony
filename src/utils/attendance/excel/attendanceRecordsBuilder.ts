
import * as XLSX from "xlsx";
import { EmployeeAttendanceRecord, EmployeeReport } from "../types";
import { applyCellBorders, applyCellTextFormatting, applyFolgaCellFormatting } from "./cellFormatUtils";

/**
 * Adds employee attendance records to the worksheet
 */
export const addEmployeeAttendanceRecords = (
  ws: XLSX.WorkSheet,
  employeeReport: EmployeeReport,
  rowIndices: {
    dataStartRow: number;
    dataEndRow: number;
    headerRow: number;
  }
): Array<{ s: { r: number, c: number }, e: { r: number, c: number } }> => {
  // Collect all FOLGA cell merges for later use
  const merges: Array<{ s: { r: number, c: number }, e: { r: number, c: number } }> = [];
  
  // Add employee attendance records
  employeeReport.attendanceRecords.forEach((record, index) => {
    const rowIndex = rowIndices.dataStartRow + index;
    
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
  
  return merges;
};
