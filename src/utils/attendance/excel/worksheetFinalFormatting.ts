
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
  // Increased column widths for better text display
  setColumnWidths(ws, [40, 15, 15, 15, 15, 15]);
  
  // Set row heights - increased for better wrapping
  const rowHeights: { [key: number]: number } = {
    [rowIndices.declarationRow]: 180,  // Declaration title and text - increased height
    [rowIndices.spacerRow]: 25,        // Spacer row
    [rowIndices.headerRow]: 30,        // Headers - increased height
  };
  
  // Standard height for data rows - increased for better readability
  for (let i = rowIndices.dataStartRow; i <= rowIndices.dataEndRow; i++) {
    rowHeights[i] = 25;
  }
  
  // Heights for special rows - increased
  rowHeights[rowIndices.totalsRow] = 30;
  rowHeights[rowIndices.workingDaysRow] = 30;
  
  if (rowIndices.signatureTextRow !== undefined && rowIndices.signatureLineRow !== undefined) {
    rowHeights[rowIndices.workingDaysRow + 1] = 25;   // Empty row
    rowHeights[rowIndices.signatureTextRow] = 60;     // Signature text - increased significantly
    rowHeights[rowIndices.signatureLineRow] = 35;     // Signature line
  }
  
  setRowHeights(ws, rowHeights);
  
  // Add the standard merges
  const standardMerges = [
    // Declaration text across all columns
    { s: { r: rowIndices.declarationRow, c: 0 }, e: { r: rowIndices.declarationRow, c: 5 } },
    
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
  
  // Fix for the ProtectInfo type error - use only valid properties defined in the ProtectInfo interface
  ws['!protect'] = {
    // Note: The 'sheet' property is not valid for ProtectInfo
    // Instead, use only the valid properties:
    password: '',           // No password protection
    objects: false,         // Don't protect objects
    scenarios: false,       // Don't protect scenarios
    formatCells: false,     // Allow formatting cells
    formatColumns: false,   // Allow formatting columns
    formatRows: false,      // Allow formatting rows
    insertColumns: false,   // Allow inserting columns
    insertRows: false,      // Allow inserting rows
    insertHyperlinks: false,// Allow inserting hyperlinks
    deleteColumns: false,   // Allow deleting columns
    deleteRows: false,      // Allow deleting rows
    selectLockedCells: true,// Allow selecting locked cells
    sort: false,            // Allow sorting
    autoFilter: false,      // Allow auto filter
    pivotTables: false,     // Allow pivot tables
    selectUnlockedCells: true // Allow selecting unlocked cells
  };
};

