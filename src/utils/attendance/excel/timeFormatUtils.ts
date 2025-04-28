
import * as XLSX from "xlsx";
import { applyCellTextFormatting } from "./formatting";
import { ensureTimeFormatting } from "./timeConversionUtils";

/**
 * Apply time formatting to a range of cells
 */
export const applyTimeFormatting = (
  ws: XLSX.WorkSheet,
  startCell: string,
  endCell: string
): void => {
  const range = XLSX.utils.decode_range(`${startCell}:${endCell}`);
  
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      if (ws[cellAddress]) {
        ws[cellAddress].z = '[h]:mm';
        
        // Also ensure text wrapping and center alignment
        applyCellTextFormatting(ws, cellAddress, {
          wrapText: true,
          horizontal: 'center',
          vertical: 'center'
        });
      }
    }
  }
  
  // Ensure time formatting for all work time cells
  ensureTimeFormatting(ws, 'E4', 'E34');
};
