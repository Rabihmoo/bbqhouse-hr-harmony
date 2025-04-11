
import * as XLSX from "xlsx";
import { applyCellFont, applyParagraphFormatting } from "./cellFormatUtils";
import { getFormattedSignatureDate } from "../declarationGenerator";

/**
 * Adds signature section to the worksheet if needed
 */
export const addSignatureSection = (
  ws: XLSX.WorkSheet,
  rowIndices: {
    workingDaysRow: number;
    signatureTextRow: number;
    signatureLineRow: number;
  }
): Array<{ s: { r: number, c: number }, e: { r: number, c: number } }> => {
  const signatureMerges: Array<{ s: { r: number, c: number }, e: { r: number, c: number } }> = [];
  
  // Empty row before signature
  for (let c = 0; c < 6; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndices.workingDaysRow + 1, c });
    ws[cellAddress] = { t: 's', v: "" };
  }
  
  // Signature text
  const signatureText = "Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.";
  const signatureTextCell = XLSX.utils.encode_cell({ r: rowIndices.signatureTextRow, c: 0 });
  ws[signatureTextCell] = { t: 's', v: signatureText };
  applyParagraphFormatting(ws, signatureTextCell, signatureText, {
    alignment: 'left'
  });
  
  // Empty cells for columns B-F in signature text row
  for (let c = 1; c < 6; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndices.signatureTextRow, c });
    ws[cellAddress] = { t: 's', v: "" };
  }
  
  // Signature line row
  const employeeSignatureCell = XLSX.utils.encode_cell({ r: rowIndices.signatureLineRow, c: 0 });
  ws[employeeSignatureCell] = { t: 's', v: "Employee Signature:" };
  applyCellFont(ws, employeeSignatureCell, { bold: true });
  
  // Empty cells for columns B-D
  for (let c = 1; c <= 3; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndices.signatureLineRow, c });
    ws[cellAddress] = { t: 's', v: "" };
  }
  
  // Date cell
  const formattedDate = getFormattedSignatureDate();
  const dateCell = XLSX.utils.encode_cell({ r: rowIndices.signatureLineRow, c: 4 });
  ws[dateCell] = { t: 's', v: `Date: ${formattedDate}` };
  applyCellFont(ws, dateCell, { bold: true });
  
  // Empty cell for column F
  const emptySigCell = XLSX.utils.encode_cell({ r: rowIndices.signatureLineRow, c: 5 });
  ws[emptySigCell] = { t: 's', v: "" };
  
  // Add signature merges
  signatureMerges.push(
    // Signature text across all columns
    { 
      s: { r: rowIndices.signatureTextRow, c: 0 }, 
      e: { r: rowIndices.signatureTextRow, c: 5 } 
    },
    
    // Employee signature cells
    { 
      s: { r: rowIndices.signatureLineRow, c: 0 }, 
      e: { r: rowIndices.signatureLineRow, c: 3 } 
    },
    
    // Date cell
    { 
      s: { r: rowIndices.signatureLineRow, c: 4 }, 
      e: { r: rowIndices.signatureLineRow, c: 5 } 
    }
  );
  
  return signatureMerges;
};
