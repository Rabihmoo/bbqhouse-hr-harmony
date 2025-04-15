
import * as XLSX from "xlsx";
import { applyParagraphFormatting, applyCellFont, applyCellTextFormatting, applyCellBorders } from "./cellFormatUtils";

/**
 * Sets the declaration content in the worksheet with enhanced text wrapping
 */
export const setDeclarationContent = (
  ws: XLSX.WorkSheet,
  fullText: string,
  declarationRow: number
): void => {
  // Split the full text into title and text parts
  const lines = fullText.split("\n");
  const title = lines[0];
  const declarationText = lines.slice(2).join("\n"); // Skip the title and empty line
  
  // Set title in cell A1 with special formatting
  const titleCell = XLSX.utils.encode_cell({ r: declarationRow, c: 0 });
  ws[titleCell] = { t: 's', v: title };
  applyParagraphFormatting(ws, titleCell, title, {
    fontSize: 14,
    bold: true,
    alignment: 'center'
  });
  
  // Set declaration text in cell A2 with enhanced wrapping and center alignment
  const textCell = XLSX.utils.encode_cell({ r: declarationRow + 1, c: 0 });
  ws[textCell] = { t: 's', v: declarationText };
  
  // Apply special formatting to ensure text wrapping works correctly
  // Use more explicit styling to force text wrapping
  ws[textCell].s = {
    alignment: {
      wrapText: true,
      vertical: 'center',
      horizontal: 'center',
      indent: 1,
      readingOrder: 2  // Left-to-right reading order
    },
    font: {
      name: 'Calibri',
      sz: 11,
      color: { rgb: '000000' }
    },
    border: {
      top: { style: 'thin', color: { auto: 1 } },
      bottom: { style: 'thin', color: { auto: 1 } },
      left: { style: 'thin', color: { auto: 1 } },
      right: { style: 'thin', color: { auto: 1 } }
    }
  };
  
  // Set explicit text format to ensure proper wrapping
  ws[textCell].z = '@';
  
  // Add headers row in row 3
  const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
  for (let i = 0; i < headers.length; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: declarationRow + 3, c: i });
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
