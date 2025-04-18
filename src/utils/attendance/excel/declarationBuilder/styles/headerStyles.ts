
import * as XLSX from "xlsx";

/**
 * Apply title style for headers
 */
export const applyTitleStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  ws[cellAddress].s.font = {
    ...(ws[cellAddress].s.font || {}),
    bold: true,
    sz: 14
  };
  ws[cellAddress].s.alignment = {
    horizontal: "center",
    vertical: "center"
  };
};

/**
 * Apply header row style
 */
export const applyHeaderStyle = (
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
    fgColor: { rgb: "EEEEEE" },
    patternType: "solid"
  };
};

