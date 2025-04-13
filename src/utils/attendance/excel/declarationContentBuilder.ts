
import * as XLSX from "xlsx";
import { applyParagraphFormatting } from "./cellFormatUtils";

/**
 * Sets the declaration content in the worksheet with enhanced text wrapping
 */
export const setDeclarationContent = (
  ws: XLSX.WorkSheet,
  fullText: string,
  declarationRow: number
): void => {
  // Set declaration text in cell A1 with enhanced wrapping
  // This ensures the text is properly displayed and wrapped in Excel
  applyParagraphFormatting(ws, "A1", fullText, {
    fontSize: 12,
    alignment: 'center',
    bold: true
  });
  
  // Add headers row in row 3
  const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
  for (let i = 0; i < headers.length; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 2, c: i });
    ws[cellAddress] = { t: 's', v: headers[i] };
    
    // Apply header formatting
    applyCellFont(ws, cellAddress, { bold: true });
    applyCellTextFormatting(ws, cellAddress, { 
      horizontal: 'center',
      vertical: 'center',
      wrapText: true
    });
    applyCellBorders(ws, cellAddress, 'thin');
  }
};

// Re-exporting these functions from cellFormatUtils to avoid circular dependencies
import { applyCellFont, applyCellTextFormatting, applyCellBorders } from "./cellFormatUtils";

