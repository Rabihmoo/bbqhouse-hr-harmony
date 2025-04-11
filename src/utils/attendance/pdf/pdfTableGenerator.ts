
import { jsPDF } from "jspdf";
import { EmployeeReport } from "../types";

/**
 * Creates the table portion of the PDF document
 */
export const createPdfTable = (
  doc: jsPDF,
  employeeReport: EmployeeReport,
  dataRows: any[]
): number => {  // Changed return type from void to number
  // Create table
  const startY = 70;
  const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
  const columnWidths = [45, 25, 25, 25, 30, 30];
  
  // Headers
  doc.setFillColor(238, 238, 238);
  doc.setDrawColor(0);
  doc.setTextColor(0);
  // Use setFont instead of setFontStyle
  doc.setFont("helvetica", "bold");
  
  let y = startY;
  let x = 10;
  headers.forEach((header, i) => {
    doc.rect(x, y, columnWidths[i], 10, "FD");
    doc.text(header, x + columnWidths[i] / 2, y + 6, { align: "center" });
    x += columnWidths[i];
  });
  
  // Data rows
  // Use setFont instead of setFontStyle
  doc.setFont("helvetica", "normal");
  y += 10;
  
  dataRows.forEach((row, rowIndex) => {
    if (rowIndex < 20) {  // Limit rows to fit on one page
      x = 10;
      
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
          doc.text("FOLGA", x + (columnWidths[2] + columnWidths[3]) / 2, y + 5, { align: "center" });
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
      
      y += 8;
    }
  });

  return y; // Return the current Y position for additional content
};
