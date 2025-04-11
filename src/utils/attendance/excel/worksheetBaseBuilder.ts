
import * as XLSX from "xlsx";

/**
 * Creates the base worksheet with initial setup
 */
export const createWorksheetBase = (): XLSX.WorkSheet => {
  // Create base worksheet with a single empty cell
  const ws = XLSX.utils.aoa_to_sheet([[""]]);
  return ws;
};
