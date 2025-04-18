
import * as XLSX from "xlsx";

/**
 * Apply declaration text style with enhanced wrapping
 */
export const applyDeclarationTextStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  // Create or ensure Excel's rich text for better rendering
  ws[cellAddress].t = 's';
  
  if (ws[cellAddress].v && typeof ws[cellAddress].v === 'string') {
    ws[cellAddress].h = ws[cellAddress].v.replace(/\n/g, '<br>');
    ws[cellAddress].r = [{
      t: ws[cellAddress].v,
      s: {
        font: { name: "Calibri", sz: 11 },
        alignment: { 
          wrapText: true, 
          vertical: "top", 
          horizontal: "center", 
          indent: 1 
        }
      }
    }];
  }
  
  ws[cellAddress].s = {
    alignment: {
      wrapText: true,
      vertical: "top",
      horizontal: "center",
      indent: 1,
      readingOrder: 2,
      shrinkToFit: false
    },
    font: {
      name: "Calibri",
      sz: 11
    },
    border: {
      top: { style: "thin", color: { auto: 1 } },
      bottom: { style: "thin", color: { auto: 1 } },
      left: { style: "thin", color: { auto: 1 } },
      right: { style: "thin", color: { auto: 1 } }
    }
  };
  
  ws[cellAddress].z = '@';
};

/**
 * Apply centered data style
 */
export const applyCenteredDataStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  ws[cellAddress].s.alignment = {
    horizontal: "center",
    vertical: "center"
  };
};

/**
 * Apply signature style
 */
export const applySignatureStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  ws[cellAddress].s.font = {
    ...(ws[cellAddress].s.font || {}),
    bold: true
  };
};

