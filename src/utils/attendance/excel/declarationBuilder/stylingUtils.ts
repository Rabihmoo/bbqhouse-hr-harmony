
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
        applyDeclarationTextStyle(ws, cellAddress);
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

