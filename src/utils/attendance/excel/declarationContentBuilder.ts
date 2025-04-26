import * as XLSX from "xlsx";
import { applyParagraphFormatting, applyCellFont, applyCellTextFormatting, applyCellBorders, applyRow2Formatting } from "./cellFormatUtils";

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
  
  // Explicitly set merged cells for title
  if (!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push({ s: { r: declarationRow, c: 0 }, e: { r: declarationRow, c: 5 } });
  
  // Set declaration text in cell A2 with enhanced wrapping and top-left alignment
  const textCell = XLSX.utils.encode_cell({ r: declarationRow + 1, c: 0 });
  
  // Create cell with comprehensive text formatting for better wrapping
  ws[textCell] = { 
    t: 's', 
    v: declarationText,
    h: declarationText.replace(/\n/g, '<br>'),  // HTML formatted text for better wrapping
  };
  
  // Add rich text format for better text wrapping in Excel
  ws[textCell].r = [{
    t: declarationText,
    s: {
      font: {
        name: 'Calibri',
        sz: 11,
        color: { rgb: '000000' }
      }
    }
  }];
  
  // Apply comprehensive alignment settings for text wrapping
  ws[textCell].s = {
    alignment: {
      wrapText: true,
      vertical: 'top',
      horizontal: 'left',
      indent: 1,
      readingOrder: 2,   // Left-to-right reading
      shrinkToFit: false  // Prevent Excel from shrinking text
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
  
  // Force text format to ensure proper text handling
  ws[textCell].z = '@';
  
  // Enhanced text wrapping for ALL cells in row 2 to ensure wrap works across Excel versions
  for (let i = 1; i <= 5; i++) {
    const otherCellAddress = XLSX.utils.encode_cell({ r: declarationRow + 1, c: i });
    if (!ws[otherCellAddress]) {
      ws[otherCellAddress] = { t: 's', v: '' };
    }
    
    // Apply comprehensive text wrapping settings to all cells in row 2
    if (!ws[otherCellAddress].s) ws[otherCellAddress].s = {};
    ws[otherCellAddress].s.alignment = {
      wrapText: true,        // Critical for text wrapping
      vertical: 'top',       // Align to top 
      horizontal: 'left',    // Left align
      shrinkToFit: false     // Prevent text from shrinking
    };
    
    // Ensure proper text format is set
    ws[otherCellAddress].z = '@';
    ws[otherCellAddress].t = 's';
    
    // Add HTML formatting if needed
    if (ws[otherCellAddress].v && typeof ws[otherCellAddress].v === 'string') {
      ws[otherCellAddress].h = ws[otherCellAddress].v.replace(/\n/g, '<br>');
      
      // Add rich text formatting for better display
      ws[otherCellAddress].r = [{
        t: ws[otherCellAddress].v,
        s: { font: { name: 'Calibri', sz: 11 } }
      }];
    }
  }
  
  // Explicitly set merged cells for declaration text
  ws['!merges'].push({ s: { r: declarationRow + 1, c: 0 }, e: { r: declarationRow + 1, c: 5 } });
  
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
