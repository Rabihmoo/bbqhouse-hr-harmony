
import * as XLSX from "xlsx";
import { applyCellTextFormatting, applyCellBorders, applyCellFont, applyCellFill } from "./cellFormatUtils";
import { ensureTimeFormatting } from "./timeConversionUtils";

/**
 * Set column widths for the worksheet
 */
export const setColumnWidths = (
  ws: XLSX.WorkSheet, 
  widths: number[]
): void => {
  ws['!cols'] = widths.map(wch => ({ wch }));
};

/**
 * Set row heights for specific rows
 */
export const setRowHeights = (
  ws: XLSX.WorkSheet,
  rowHeights: { [rowIndex: number]: number }
): void => {
  if (!ws['!rows']) ws['!rows'] = [];
  
  Object.entries(rowHeights).forEach(([rowIndex, height]) => {
    const index = parseInt(rowIndex, 10);
    ws['!rows'][index] = { hpt: height };
  });
};

/**
 * Define merged cells in the worksheet
 */
export const setMergedCells = (
  ws: XLSX.WorkSheet,
  merges: {
    s: { r: number, c: number },
    e: { r: number, c: number }
  }[]
): void => {
  ws['!merges'] = merges;
};

/**
 * Apply time formatting to a range of cells
 */
export const applyTimeFormatting = (
  ws: XLSX.WorkSheet,
  startCell: string,
  endCell: string
): void => {
  const range = XLSX.utils.decode_range(`${startCell}:${endCell}`);
  
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      if (ws[cellAddress]) {
        ws[cellAddress].z = '[h]:mm';
      }
    }
  }
  
  // Ensure time formatting for all work time cells (Column E)
  ensureTimeFormatting(ws, 'E4', 'E34');
};

/**
 * Apply formatting to all cells in a worksheet
 */
export const applyFormattingToAllCells = (
  ws: XLSX.WorkSheet,
  options: {
    headerRow?: number,
    boldRows?: number[],
    applyBorders?: boolean
  }
): void => {
  const range = XLSX.utils.decode_range(ws['!ref'] || "A1");
  
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      
      // Create cell if it doesn't exist
      if (!ws[cellAddress]) {
        ws[cellAddress] = { t: 's', v: '' };
      }
      
      // Apply borders if needed
      if (options.applyBorders) {
        applyCellBorders(ws, cellAddress);
      }
      
      // Apply header formatting
      if (options.headerRow !== undefined && r === options.headerRow) {
        applyCellFont(ws, cellAddress, { bold: true });
        applyCellFill(ws, cellAddress, "EEEEEE");
        
        // Center align headers
        applyCellTextFormatting(ws, cellAddress, { 
          horizontal: 'center',
          vertical: 'center'
        });
      }
      
      // Apply bold to specific rows
      if (options.boldRows && options.boldRows.includes(r)) {
        applyCellFont(ws, cellAddress, { bold: true });
      }
      
      // Center align data in columns B through F
      if (r > (options.headerRow || 0) && c >= 1 && c <= 5) {
        applyCellTextFormatting(ws, cellAddress, { 
          horizontal: 'center',
          vertical: 'center'
        });
      }
    }
  }
  
  // Ensure time formatting for work time column
  ensureTimeFormatting(ws, 'E4', 'E34'); // Column E (Work Time) from row 4 to 34
};

/**
 * Add autofilter to a specified range
 */
export const addAutoFilter = (
  ws: XLSX.WorkSheet,
  range: string
): void => {
  ws['!autofilter'] = { ref: range };
};
