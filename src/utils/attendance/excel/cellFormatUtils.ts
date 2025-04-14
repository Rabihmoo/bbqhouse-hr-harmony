
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
    indent: 1 // Add some indent for better text display
  };
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
  
  // For Excel, we need to use \r\n for line breaks
  // First convert any existing line breaks
  const formattedText = text.replace(/\n/g, '\r\n');
  
  // Set the cell value
  ws[cellAddress].v = formattedText;
  ws[cellAddress].t = 's';
  
  // Apply styling
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  
  // Setup explicit wrapping configuration with better settings
  ws[cellAddress].s.alignment = {
    wrapText: true,
    vertical: 'center',
    horizontal: options?.alignment || 'center', // Default to center alignment
    indent: 1 // Add indent for better text presentation
  };
  
  // Apply font styling if provided
  ws[cellAddress].s.font = {
    ...(ws[cellAddress].s.font || {}),
    bold: options?.bold ?? false,
    italic: options?.italic ?? false,
    sz: options?.fontSize || 11,
    name: 'Calibri',
    color: { rgb: '000000' } // Make sure text is black for better visibility
  };
  
  // Make sure to explicitly set format to allow proper text rendering and force wrap
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
};
