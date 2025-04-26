
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
        // For row 2 (index 1), apply special text wrapping without setting row height
        // Create style object if it doesn't exist
        if (!ws[cellAddress].s) ws[cellAddress].s = {};
        
        // Force text wrapping with comprehensive settings for Excel
        ws[cellAddress].s.alignment = {
          wrapText: true,
          vertical: 'top',
          horizontal: 'left',
          indent: 1,
          readingOrder: 2, // Left-to-right reading
          shrinkToFit: false // Prevent Excel from shrinking text
        };
        
        // Set text format
        ws[cellAddress].z = '@';
        
        // Explicitly set string type for cell
        ws[cellAddress].t = 's';
        
        // Convert to html content with breaks for Excel
        if (ws[cellAddress].v && typeof ws[cellAddress].v === 'string') {
          ws[cellAddress].h = ws[cellAddress].v.replace(/\n/g, '<br>');
          
          // Add rich text format for better wrapping across Excel versions
          ws[cellAddress].r = [{
            t: ws[cellAddress].v,
            s: { font: { name: "Calibri", sz: 11 } }
          }];
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
