
import * as XLSX from "xlsx";
import { applyBaseCellStyle } from "./styles/baseCellStyles";
import { applyTitleStyle, applyHeaderStyle } from "./styles/headerStyles";
import { 
  applyDeclarationTextStyle, 
  applyCenteredDataStyle, 
  applySignatureStyle 
} from "./styles/contentStyles";
import { 
  applyFolgaStyle, 
  applyTotalRowStyle 
} from "./styles/specialStyles";

/**
 * Apply styling to the worksheet cells
 */
export const applyDeclarationStyles = (
  ws: XLSX.WorkSheet,
  maxRow: number
): void => {
  // Process all cells
  for (let r = 0; r <= maxRow; r++) {
    for (let c = 0; c <= 5; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      
      // Skip if cell doesn't exist
      if (!ws[cellAddress]) continue;
      
      // Apply base styles
      applyBaseCellStyle(ws, cellAddress);
      
      // Apply specialized styling based on cell position and content
      if (r === 0) {
        applyTitleStyle(ws, cellAddress);
      } else if (r === 1) {
        // Enhanced wrapping for row 2 (index 1) across all columns A-F
        // This special handling ensures text wrapping works reliably in Excel
        if (c <= 5) {
          // Ensure cell exists and has necessary properties
          if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
          if (!ws[cellAddress].s) ws[cellAddress].s = {};
          
          // Apply consistent text wrapping properties to all cells in row 2
          ws[cellAddress].s.alignment = {
            wrapText: true,           // Critical for text wrapping
            vertical: 'top',          // Align to top for better text flow
            horizontal: c === 0 ? 'left' : 'center', // Left align main text
            indent: 1,                // Add slight indent
            readingOrder: 2           // Left-to-right reading
          };
          
          // Ensure text format is set for better rendering
          ws[cellAddress].z = '@';    // Text format
        }
        
        // Apply declaration text style with enhanced wrapping
        if (c === 0) {
          applyDeclarationTextStyle(ws, cellAddress);
        }
      } else if (r === 3) {
        applyHeaderStyle(ws, cellAddress);
      } else if (ws[cellAddress].v === "FOLGA") {
        applyFolgaStyle(ws, cellAddress);
      } else if (cellAddress.includes("A") && (
        ws[cellAddress].v === "TOTAL WORKING HOURS" || 
        ws[cellAddress].v === "WORKING DAYS")) {
        applyTotalRowStyle(ws, cellAddress);
      } else if (r >= 4 && r <= maxRow && c >= 1 && c <= 5) {
        applyCenteredDataStyle(ws, cellAddress);
      } else if (r >= maxRow - 3 && cellAddress.includes("A") && 
        typeof ws[cellAddress].v === "string" && 
        ws[cellAddress].v.includes("Assinatura")) {
        applySignatureStyle(ws, cellAddress);
      }
    }
  }
};
