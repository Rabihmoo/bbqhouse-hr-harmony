
import * as XLSX from "xlsx";

/**
 * Set column widths for the worksheet with reasonable values
 */
export const setColumnWidths = (
  ws: XLSX.WorkSheet, 
  widths: number[]
): void => {
  // For Excel, width is measured in characters
  // Using standard Excel width measurement
  ws['!cols'] = widths.map(wch => ({ 
    wch, 
    hidden: false
  }));
};

/**
 * Set row heights for specific rows with enhanced precision for wrapped text
 * Deliberately skips row 2 (index 1) to let Excel auto-size it based on content
 */
export const setRowHeights = (
  ws: XLSX.WorkSheet,
  rowHeights: { [rowIndex: number]: number }
): void => {
  if (!ws['!rows']) ws['!rows'] = [];
  
  Object.entries(rowHeights).forEach(([rowIndex, height]) => {
    const index = parseInt(rowIndex, 10);
    
    // Skip setting row height for row 2 (index 1)
    if (index === 1) return;
    
    // Use hpt (height-points) for precise control of row height
    ws['!rows'][index] = { 
      hpt: height, // Height in points
      hidden: false
    };
  });
  
  // CRITICAL: Explicitly remove any height setting for row 2 if it exists
  // This ensures Excel auto-sizes based on content and wrapping
  delete ws['!rows'][1];
};

/**
 * Define merged cells in the worksheet
 */
export const setMergedCells = (
  ws: XLSX.WorkSheet,
  merges: {
    s: { r: number, c: number },
    e: { r: number, c: number }
  }[]
): void => {
  ws['!merges'] = merges;
};
