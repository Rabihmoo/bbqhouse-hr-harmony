
import * as XLSX from "xlsx";

/**
 * Apply base cell style with basic formatting
 */
export const applyBaseCellStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  // Default font
  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  
  ws[cellAddress].s.font = {
    name: "Calibri",
    sz: 11
  };
  
  // Default borders
  ws[cellAddress].s.border = {
    top: { style: "thin", color: { auto: 1 } },
    bottom: { style: "thin", color: { auto: 1 } },
    left: { style: "thin", color: { auto: 1 } },
    right: { style: "thin", color: { auto: 1 } }
  };
};

