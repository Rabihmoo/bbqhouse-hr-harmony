
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
    wrapText: options.wrapText ?? true,
    vertical: options.vertical ?? 'center',
    horizontal: options.horizontal ?? 'left',
    indent: 1,
    readingOrder: 2
  };
  
  ws[cellAddress].z = '@';
};

/**
 * Enhanced text formatting for declaration text with better wrapping
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
  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
  
  ws[cellAddress].v = text;
  ws[cellAddress].t = 's';
  ws[cellAddress].h = text.replace(/\n/g, '<br>');
  
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
  
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  
  ws[cellAddress].s.alignment = {
    wrapText: true,
    vertical: 'center',
    horizontal: options?.alignment || 'center',
    indent: 1,
    readingOrder: 2
  };
  
  ws[cellAddress].z = '@';
};
