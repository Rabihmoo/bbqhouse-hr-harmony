
import * as XLSX from "xlsx";
import { setColumnWidths, setRowHeights, setMergedCells } from "./worksheetFormatUtils";

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
  // Using more reasonable column widths for better text display
  setColumnWidths(ws, [25, 15, 15, 15, 15, 15]);
  
  // Set row heights with more reasonable values
  const rowHeights: { [key: number]: number } = {
    [rowIndices.declarationRow]: 30,     // Title row
    [rowIndices.declarationRow + 1]: 250, // Declaration text - significantly increased height to fit all text
    [rowIndices.spacerRow]: 20,         // Spacer row
    [rowIndices.headerRow]: 25,         // Headers
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
    rowHeights[rowIndices.signatureTextRow] = 80;     // Signature text
    rowHeights[rowIndices.signatureLineRow] = 30;     // Signature line
  }
  
  setRowHeights(ws, rowHeights);
  
  // Add the standard merges
  const standardMerges = [
    // Declaration title across all columns
    { s: { r: rowIndices.declarationRow, c: 0 }, e: { r: rowIndices.declarationRow, c: 5 } },
    
    // Declaration text across all columns
    { s: { r: rowIndices.declarationRow + 1, c: 0 }, e: { r: rowIndices.declarationRow + 1, c: 5 } },
    
    // Totals label across four columns
    { s: { r: rowIndices.totalsRow, c: 0 }, e: { r: rowIndices.totalsRow, c: 3 } },
    
    // Working days label across four columns
    { s: { r: rowIndices.workingDaysRow, c: 0 }, e: { r: rowIndices.workingDaysRow, c: 3 } }
  ];
  
  // Combine all merges
  const allMerges = [...standardMerges, ...merges];
  
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
