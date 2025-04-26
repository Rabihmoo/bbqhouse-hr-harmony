import * as XLSX from "xlsx";
import { setColumnWidths, setRowHeights, setMergedCells } from "./dimensionUtils";

/**
 * Applies final comprehensive formatting to the worksheet
 */
export const applyFinalFormatting = (
  ws: XLSX.WorkSheet,
  merges: Array<{ s: { r: number, c: number }, e: { r: number, c: number } }>,
  lastRow: number,
  rowIndices: {
    declarationRow: number;
    spacerRow: number;
    headerRow: number;
    dataStartRow: number;
    dataEndRow: number;
    totalsRow: number;
    workingDaysRow: number;
    signatureTextRow?: number;
    signatureLineRow?: number;
  }
): void => {
  // Set column widths (Name, Date, Clock In, Clock Out, Work Time, Extra Hours)
  // Make first column extra wide to improve wrapping
  setColumnWidths(ws, [50, 15, 15, 15, 15, 15]);
  
  // Set row heights with much larger values for declaration text row
  const rowHeights: { [key: number]: number } = {
    [rowIndices.declarationRow]: 40,      // Title row - slightly taller
    [rowIndices.declarationRow + 1]: 400, // Declaration text - extremely increased height
    [rowIndices.spacerRow]: 20,           // Spacer row
    [rowIndices.headerRow]: 25,           // Headers
  };
  
  // Standard height for data rows - more reasonable height
  for (let i = rowIndices.dataStartRow; i <= rowIndices.dataEndRow; i++) {
    rowHeights[i] = 20;
  }
  
  // Heights for special rows
  rowHeights[rowIndices.totalsRow] = 25;
  rowHeights[rowIndices.workingDaysRow] = 25;
  
  if (rowIndices.signatureTextRow !== undefined && rowIndices.signatureLineRow !== undefined) {
    rowHeights[rowIndices.workingDaysRow + 1] = 20;   // Empty row
    rowHeights[rowIndices.signatureTextRow] = 100;    // Signature text - increased height
    rowHeights[rowIndices.signatureLineRow] = 30;     // Signature line
  }
  
  setRowHeights(ws, rowHeights);
  
  // Combine all merges and ensure the declaration text spans all columns
  const allMerges = [...merges];
  
  // Set all merges
  setMergedCells(ws, allMerges);
  
  // Set the worksheet reference range
  ws['!ref'] = XLSX.utils.encode_range(
    { r: 0, c: 0 },
    { r: lastRow, c: 5 }
  );
  
  // Remove worksheet protection completely
  delete ws['!protect'];
};
