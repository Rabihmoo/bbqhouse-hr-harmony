import * as XLSX from "xlsx";

/**
 * Applies text formatting to a cell with improved text wrapping
 */
export const applyCellTextFormatting = (
  ws: XLSX.WorkSheet,
  cellAddress: string,
  options: {
    wrapText?: boolean;
    vertical?: 'top' | 'center' | 'bottom';
    horizontal?: 'left' | 'center' | 'right';
  }
): void => {
  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  
  ws[cellAddress].s.alignment = { 
    wrapText: options.wrapText ?? true, // Default to true for better text display
    vertical: options.vertical ?? 'center', // Default to center for better appearance
    horizontal: options.horizontal ?? 'left',
    indent: 1, // Add some indent for better text display
    readingOrder: 2 // Left-to-right reading order
  };
  
  // Force text format for better display
  ws[cellAddress].z = '@';
};

/**
 * Applies border styling to a cell
 */
export const applyCellBorders = (
  ws: XLSX.WorkSheet,
  cellAddress: string,
  style: 'thin' | 'medium' | 'thick' = 'thin'
): void => {
  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  
  ws[cellAddress].s.border = {
    top: { style, color: { auto: 1 } },
    bottom: { style, color: { auto: 1 } },
    left: { style, color: { auto: 1 } },
    right: { style, color: { auto: 1 } }
  };
};

/**
 * Applies font styling to a cell
 */
export const applyCellFont = (
  ws: XLSX.WorkSheet,
  cellAddress: string,
  options: {
    bold?: boolean;
    size?: number;
    name?: string;
    italic?: boolean;
  }
): void => {
  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  
  ws[cellAddress].s.font = {
    ...(ws[cellAddress].s.font || {}),
    bold: options.bold ?? false,
    sz: options.size ?? (options.bold ? 12 : 11), // Slightly larger for bold text
    name: options.name ?? 'Calibri',
    italic: options.italic ?? false
  };
};

/**
 * Applies background fill to a cell
 */
export const applyCellFill = (
  ws: XLSX.WorkSheet,
  cellAddress: string,
  color: string
): void => {
  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  
  ws[cellAddress].s.fill = { 
    fgColor: { rgb: color },
    patternType: 'solid'
  };
};

/**
 * Enhanced text formatting for declaration text with better wrapping
 * Improved to ensure text is properly wrapped in Excel with reasonable width
 */
export const applyParagraphFormatting = (
  ws: XLSX.WorkSheet,
  cellAddress: string,
  text: string,
  options?: {
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    alignment?: 'left' | 'center' | 'right';
  }
): void => {
  // Ensure the cell exists
  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
  
  // Set the cell value as a string
  ws[cellAddress].v = text;
  ws[cellAddress].t = 's';
  
  // Add HTML-formatted version to help with wrapping
  ws[cellAddress].h = text.replace(/\n/g, '<br>');
  
  // Create rich text array for better text handling
  ws[cellAddress].r = [{
    t: text,
    s: {
      font: {
        name: 'Calibri',
        sz: options?.fontSize || 11,
        bold: options?.bold ?? false,
        italic: options?.italic ?? false,
        color: { rgb: '000000' }
      }
    }
  }];
  
  // Apply styling with explicit alignment settings
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  
  // Setup explicit wrapping configuration
  ws[cellAddress].s.alignment = {
    wrapText: true,
    vertical: 'center',
    horizontal: options?.alignment || 'center',
    indent: 1,
    readingOrder: 2
  };
  
  // Apply borders
  ws[cellAddress].s.border = {
    top: { style: 'thin', color: { auto: 1 } },
    bottom: { style: 'thin', color: { auto: 1 } },
    left: { style: 'thin', color: { auto: 1 } },
    right: { style: 'thin', color: { auto: 1 } }
  };
  
  // Explicitly set format to allow proper text rendering
  ws[cellAddress].z = '@';
}

/**
 * Specifically formats FOLGA cells with proper formatting
 */
export const applyFolgaCellFormatting = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: 'FOLGA' };
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
  applyCellFont(ws, cellAddress, { 
    bold: true,
    size: 12
  });
  
  // Add yellow background
  applyCellFill(ws, cellAddress, "FEF7CD");
};

/**
 * Specifically formats all cells in row 2 with consistent wrap text
 */
export const applyRow2Formatting = (
  ws: XLSX.WorkSheet
): void => {
  // Apply text wrapping to all cells in row 2 (index 1)
  for (let c = 0; c <= 5; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c });
    
    // Create the cell if it doesn't exist
    if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
    
    // Apply consistent text wrapping
    applyCellTextFormatting(ws, cellAddress, {
      wrapText: true,
      vertical: 'top',
      horizontal: 'left'
    });
  }
};
