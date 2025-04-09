
import { jsPDF } from "jspdf";
import { AttendanceRecord } from "../types";

/**
 * Renders a row in the attendance table
 * Handles special cases like FOLGA
 */
export const renderTableRow = (
  doc: jsPDF, 
  row: any[], 
  y: number, 
  columnWidths: number[] = [45, 25, 25, 25, 30, 30]
): number => {
  let x = 20;
  
  // Check for FOLGA special case
  const isFolga = row[2] === "FOLGA";
  
  row.forEach((cell, cellIndex) => {
    // Format time values properly
    let cellText = cell.toString();
    
    // Handle numeric time values
    if (cellIndex === 4 || cellIndex === 5) { // Work Time or Extra Hours column
      if (typeof cell === 'number') {
        // Convert Excel time value to HH:MM format
        const totalMinutes = Math.round(cell * 24 * 60); // Convert to minutes
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        cellText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
    
    // Handle merging for FOLGA
    if (isFolga && cellIndex === 2) {
      // Draw the merged FOLGA cell with proper border and centered text
      doc.rect(x, y, columnWidths[2] + columnWidths[3], 8);
      doc.setFont("helvetica", "bold");
      doc.text("FOLGA", x + (columnWidths[2] + columnWidths[3]) / 2, y + 5, { align: "center" });
      doc.setFont("helvetica", "normal");
      x += columnWidths[2] + columnWidths[3];
      return;
    }
    
    // Skip the clock out cell for FOLGA rows
    if (isFolga && cellIndex === 3) {
      return;
    }
    
    // Draw normal cell
    doc.rect(x, y, columnWidths[cellIndex], 8);
    doc.text(cellText, x + columnWidths[cellIndex] / 2, y + 5, { align: "center" });
    x += columnWidths[cellIndex];
  });
  
  return y + 8; // Return next Y position
};

/**
 * Renders the entire attendance table with all records
 * Returns the Y position after the table
 */
export const renderAttendanceTable = (
  doc: jsPDF,
  sheetData: any[][],
  startY: number
): number => {
  let y = startY;
  doc.setFont("helvetica", "normal");
  
  // Get actual data rows (skip headers and empty rows)
  const dataRows = sheetData.slice(2).filter(row => row.length > 0 && row[0] !== "");
  
  // Render each row, up to a maximum of 25 to fit on one page
  dataRows.forEach((row, rowIndex) => {
    if (rowIndex < 25) { // Limit rows to fit on one page
      y = renderTableRow(doc, row, y);
    }
  });
  
  return y + 10; // Return Y position after table with some padding
};

/**
 * Format time values for display in cells
 */
export const formatTimeForPdf = (timeValue: number): string => {
  const totalMinutes = Math.round(timeValue * 24 * 60); // Convert to minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
