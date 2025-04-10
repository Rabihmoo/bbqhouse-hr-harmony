
import * as XLSX from "xlsx";

/**
 * Applies text wrapping and alignment to a cell
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
    wrapText: options.wrapText ?? false, 
    vertical: options.vertical ?? 'top', 
    horizontal: options.horizontal ?? 'left' 
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
    top: { style },
    bottom: { style },
    left: { style },
    right: { style }
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
    ...options
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
    fgColor: { rgb: color } 
  };
};

/**
 * Specifically formats paragraph text with proper wrapping and formatting
 * This function is specifically designed to handle multi-line text in Excel
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
  
  // Replace \n with explicit line breaks for Excel
  // This ensures proper line breaks within the cell
  const formattedText = text.replace(/\n/g, '\r\n');
  
  // Set the cell value
  ws[cellAddress].v = formattedText;
  ws[cellAddress].t = 's';
  
  // Apply styling
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  
  // Ensure text wrapping is enabled
  ws[cellAddress].s.alignment = {
    wrapText: true,
    vertical: 'center',
    horizontal: options?.alignment || 'center',
  };
  
  // Apply font styling if provided
  ws[cellAddress].s.font = {
    ...(ws[cellAddress].s.font || {}),
    bold: options?.bold ?? false,
    italic: options?.italic ?? false,
    sz: options?.fontSize || 12,
  };
}

/**
 * Specifically formats FOLGA cells with proper alignment and border
 */
export const applyFolgaCellFormatting = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
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
  applyCellFont(ws, cellAddress, { bold: true });
};
