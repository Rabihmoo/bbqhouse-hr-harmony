
import * as XLSX from "xlsx";
import { 
  applyCellTextFormatting, 
  applyCellBorders, 
  applyCellFont, 
  applyCellFill,
  applyRow2Formatting
} from "./formatting";

/**
 * Apply comprehensive formatting to all cells in a worksheet
 * Enhanced with better text wrapping support but without changing row heights
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
  
  // Specifically apply text wrapping to row 2 without changing height
  applyRow2Formatting(ws);
  
  // Special wrapping for declaration text in row 1 column A
  if (ws['A2']) {
    applyCellTextFormatting(ws, 'A2', {
      wrapText: true,
      horizontal: 'left',
      vertical: 'top'
    });
    // Force text format type
    ws['A2'].z = '@';
    
    // Add HTML formatting for better wrapping
    if (ws['A2'].v && typeof ws['A2'].v === 'string') {
      ws['A2'].h = ws['A2'].v.replace(/\n/g, '<br>');
      
      // Add rich text format
      ws['A2'].r = [{
        t: ws['A2'].v,
        s: { font: { name: "Calibri", sz: 11 } }
      }];
    }
  }
  
  // Apply similar wrapping to all cells in row 2
  for (let c = 0; c <= 5; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c });
    if (!ws[cellAddress]) continue;
    
    applyCellTextFormatting(ws, cellAddress, {
      wrapText: true,
      vertical: 'top',
      horizontal: 'left'
    });
  }
};
