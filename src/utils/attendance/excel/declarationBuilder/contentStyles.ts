
import * as XLSX from "xlsx";

/**
 * Apply declaration text style with enhanced wrapping
 */
export const applyDeclarationTextStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  // Create or ensure cell has string type for better rendering
  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
  ws[cellAddress].t = 's';
  
  // If the cell has text content, apply HTML formatting for proper wrapping
  if (ws[cellAddress].v && typeof ws[cellAddress].v === 'string') {
    // Add HTML-formatted version to improve wrapping in some Excel versions
    ws[cellAddress].h = ws[cellAddress].v.replace(/\n/g, '<br>');
  }
  
  // Apply comprehensive styling for the declaration text cell
  ws[cellAddress].s = {
    alignment: {
      wrapText: true,        // Critical for text wrapping
      vertical: "top",        // Align to top for declaration text
      horizontal: "left",     // Left align for better readability
      indent: 1,              // Slight indent
      shrinkToFit: false      // Prevent text shrinking
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
  
  // Set format to text for proper display
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
