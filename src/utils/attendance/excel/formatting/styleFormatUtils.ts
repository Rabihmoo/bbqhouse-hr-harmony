
import * as XLSX from "xlsx";

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
    sz: options.size ?? (options.bold ? 12 : 11),
    name: options.name ?? 'Calibri',
    italic: options.italic ?? false
  };
};

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
