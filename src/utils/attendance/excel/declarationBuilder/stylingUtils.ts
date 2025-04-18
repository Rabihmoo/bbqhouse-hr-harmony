
import * as XLSX from "xlsx";

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
      
      // Create style object if it doesn't exist
      if (!ws[cellAddress].s) ws[cellAddress].s = {};
      
      // Apply base styles
      applyBaseCellStyle(ws, cellAddress);
      
      // Apply specialized styling
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

/**
 * Apply base cell style
 */
const applyBaseCellStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  // Default font
  ws[cellAddress].s.font = {
    name: "Calibri",
    sz: 11
  };
  
  // Default borders
  ws[cellAddress].s.border = {
    top: { style: "thin", color: { auto: 1 } },
    bottom: { style: "thin", color: { auto: 1 } },
    left: { style: "thin", color: { auto: 1 } },
    right: { style: "thin", color: { auto: 1 } }
  };
};

/**
 * Apply title style
 */
const applyTitleStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  ws[cellAddress].s.font.bold = true;
  ws[cellAddress].s.font.sz = 14;
  ws[cellAddress].s.alignment = {
    horizontal: "center",
    vertical: "center"
  };
};

/**
 * Apply declaration text style with significantly enhanced wrapping
 */
const applyDeclarationTextStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  // Create or ensure Excel's rich text for better rendering
  ws[cellAddress].t = 's'; // Force string type
  
  // Convert any newlines to Excel-friendly format
  if (ws[cellAddress].v && typeof ws[cellAddress].v === 'string') {
    // Create both HTML and plain text versions for better compatibility
    ws[cellAddress].h = ws[cellAddress].v.replace(/\n/g, '<br>');
    
    // Force Excel to recognize this as rich text with wrapping
    ws[cellAddress].r = [{
      t: ws[cellAddress].v,
      s: {
        font: { name: "Calibri", sz: 11 },
        alignment: { 
          wrapText: true, 
          vertical: "top", 
          horizontal: "left", 
          indent: 1 
        }
      }
    }];
  }
  
  // Apply explicit styling with maximum wrap text settings
  ws[cellAddress].s = {
    alignment: {
      wrapText: true,
      vertical: "top",
      horizontal: "left",
      indent: 1,
      readingOrder: 2,
      shrinkToFit: false
    },
    font: {
      name: "Calibri",
      sz: 11
    },
    border: {
      top: { style: "thin", color: { auto: 1 } },
      bottom: { style: "thin", color: { auto: 1 } },
      left: { style: "thin", color: { auto: 1 } },
      right: { style: "thin", color: { auto: 1 } }
    }
  };
  
  // Force text format
  ws[cellAddress].z = '@';
};

/**
 * Apply header row style
 */
const applyHeaderStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  ws[cellAddress].s.font.bold = true;
  ws[cellAddress].s.alignment = {
    horizontal: "center",
    vertical: "center"
  };
  ws[cellAddress].s.fill = {
    fgColor: { rgb: "EEEEEE" },
    patternType: "solid"
  };
};

/**
 * Apply FOLGA cell style
 */
const applyFolgaStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  ws[cellAddress].s.font.bold = true;
  ws[cellAddress].s.alignment = {
    horizontal: "center",
    vertical: "center"
  };
  ws[cellAddress].s.fill = {
    fgColor: { rgb: "FEF7CD" },
    patternType: "solid"
  };
};

/**
 * Apply total row style
 */
const applyTotalRowStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  ws[cellAddress].s.font.bold = true;
  ws[cellAddress].s.alignment = {
    horizontal: "right",
    vertical: "center"
  };
};

/**
 * Apply centered data style
 */
const applyCenteredDataStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  ws[cellAddress].s.alignment = {
    horizontal: "center",
    vertical: "center"
  };
};

/**
 * Apply signature style
 */
const applySignatureStyle = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  ws[cellAddress].s.font.bold = true;
};
