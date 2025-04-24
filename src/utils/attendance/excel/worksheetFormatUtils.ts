import * as XLSX from "xlsx";
import { applyCellTextFormatting, applyCellBorders, applyCellFont, applyCellFill, applyRow2Formatting } from "./cellFormatUtils";
import { ensureTimeFormatting } from "./timeConversionUtils";

/**
 * Set column widths for the worksheet with reasonable values
 */
export const setColumnWidths = (
  ws: XLSX.WorkSheet, 
  widths: number[]
): void => {
  // For Excel, width is measured in characters
  // Using standard Excel width measurement
  ws['!cols'] = widths.map(wch => ({ 
    wch, 
    hidden: false
  }));
};

/**
 * Set row heights for specific rows with enhanced precision for wrapped text
 */
export const setRowHeights = (
  ws: XLSX.WorkSheet,
  rowHeights: { [rowIndex: number]: number }
): void => {
  if (!ws['!rows']) ws['!rows'] = [];
  
  Object.entries(rowHeights).forEach(([rowIndex, height]) => {
    const index = parseInt(rowIndex, 10);
    // Use hpt (height-points) for precise control of row height
    ws['!rows'][index] = { 
      hpt: height, // Height in points
      hidden: false
    };
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
        
        // Also ensure text wrapping and center alignment
        applyCellTextFormatting(ws, cellAddress, {
          wrapText: true,
          horizontal: 'center',
          vertical: 'center'
        });
      }
    }
  }
  
  // Ensure time formatting for all work time cells
  ensureTimeFormatting(ws, 'E4', 'E34');
};

/**
 * Apply comprehensive formatting to all cells in a worksheet
 * Enhanced with better text wrapping support
 */
export const applyFormattingToAllCells = (
  ws: XLSX.WorkSheet,
  options: {
    headerRow?: number,
    boldRows?: number[],
    applyBorders?: boolean,
    applyWrapText?: boolean,
    fontName?: string,
    fontSize?: number
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
      
      // Apply borders if needed - default to true
      if (options.applyBorders !== false) {
        applyCellBorders(ws, cellAddress);
      }
      
      // Apply wrap text - default to true for better readability
      applyCellTextFormatting(ws, cellAddress, {
        wrapText: options.applyWrapText !== false,
        vertical: 'center',
        horizontal: 'center'
      });
      
      // Apply font if specified
      if (options.fontName || options.fontSize) {
        applyCellFont(ws, cellAddress, {
          name: options.fontName || 'Calibri',
          size: options.fontSize || 11
        });
      }
      
      // Apply header formatting
      if (options.headerRow !== undefined && r === options.headerRow) {
        applyCellFont(ws, cellAddress, { bold: true, size: 12 });
        applyCellFill(ws, cellAddress, "EEEEEE");
        
        // Center align headers
        applyCellTextFormatting(ws, cellAddress, { 
          horizontal: 'center',
          vertical: 'center',
          wrapText: true
        });
      }
      
      // Apply bold to specific rows
      if (options.boldRows && options.boldRows.includes(r)) {
        applyCellFont(ws, cellAddress, { bold: true, size: 12 });
      }
      
      // Center align data in columns B through F
      if (r > (options.headerRow || 0) && c >= 1 && c <= 5) {
        applyCellTextFormatting(ws, cellAddress, { 
          horizontal: 'center',
          vertical: 'center',
          wrapText: true
        });
      }
    }
  }
  
  // Specifically apply text wrapping to row 2
  applyRow2Formatting(ws);
  
  // Make special adjustments for declaration text in row 1
  if (ws['A1']) {
    applyCellTextFormatting(ws, 'A1', {
      wrapText: true,
      horizontal: 'center',
      vertical: 'center'
    });
  }
  
  // Make special adjustments for main declaration text in row 1
  if (ws['A2']) {
    applyCellTextFormatting(ws, 'A2', {
      wrapText: true,
      horizontal: 'center',
      vertical: 'center'
    });
    // Force text format type
    ws['A2'].z = '@';
  }
  
  // Ensure time formatting for work time column
  ensureTimeFormatting(ws, 'E4', 'E34');
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
