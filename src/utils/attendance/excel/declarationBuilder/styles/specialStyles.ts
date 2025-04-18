
import * as XLSX from "xlsx";

/**
 * Apply FOLGA cell style
 */
export const applyFolgaStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  ws[cellAddress].s.font = {
    ...(ws[cellAddress].s.font || {}),
    bold: true
  };
  ws[cellAddress].s.alignment = {
    horizontal: "center",
    vertical: "center"
  };
  ws[cellAddress].s.fill = {
    fgColor: { rgb: "FEF7CD" },
    patternType: "solid"
  };
};

/**
 * Apply total row style
 */
export const applyTotalRowStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  ws[cellAddress].s.font = {
    ...(ws[cellAddress].s.font || {}),
    bold: true
  };
  ws[cellAddress].s.alignment = {
    horizontal: "right",
    vertical: "center"
  };
};

