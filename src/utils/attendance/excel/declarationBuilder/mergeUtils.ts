
import * as XLSX from "xlsx";

/**
 * Creates merge definitions for the declaration sheet
 */
export const applySpecialMerges = (
  recordsLength: number,
  includeSignature: boolean
): XLSX.Range[] => {
  // Define merges
  const merges: XLSX.Range[] = [
    // Title row
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    
    // Declaration text
    { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
    
    // Total hours label
    { s: { r: 4 + recordsLength, c: 0 }, 
      e: { r: 4 + recordsLength, c: 3 } },
    
    // Working days label
    { s: { r: 5 + recordsLength, c: 0 }, 
      e: { r: 5 + recordsLength, c: 3 } },
  ];
  
  // Signature section merges
  if (includeSignature) {
    // Signature text
    merges.push({
      s: { r: 7 + recordsLength, c: 0 },
      e: { r: 7 + recordsLength, c: 5 }
    });
    
    // Signature line
    merges.push({
      s: { r: 9 + recordsLength, c: 0 },
      e: { r: 9 + recordsLength, c: 5 }
    });
  }
  
  return merges;
};

/**
 * Adds FOLGA merges for attendance records
 */
export const addFolgaMerges = (
  ws: XLSX.WorkSheet,
  recordsLength: number
): void => {
  if (!ws["!merges"]) ws["!merges"] = [];
  
  // Check each row for FOLGA status
  for (let i = 0; i < recordsLength; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 4 + i, c: 2 });
    
    if (ws[cellAddress] && ws[cellAddress].v === "FOLGA") {
      ws["!merges"].push({
        s: { r: 4 + i, c: 2 }, // Clock In cell
        e: { r: 4 + i, c: 3 }  // Clock Out cell
      });
    }
  }
};
