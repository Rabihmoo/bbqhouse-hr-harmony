
import { jsPDF } from "jspdf";
import { EmployeeReport } from "../types";

/**
 * Renders attendance table headers
 */
export const renderTableHeaders = (doc: jsPDF, startY: number): number => {
  const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
  const columnWidths = [45, 25, 25, 25, 30, 30];
  
  // Headers styling - using smaller font size for headers
  doc.setFillColor(238, 238, 238);
  doc.setDrawColor(0);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9); // Reduced from default to save space
  
  let y = startY;
  let x = 10;
  
  headers.forEach((header, i) => {
    doc.rect(x, y, columnWidths[i], 8, "FD"); // Reduced row height from 10 to 8
    doc.text(header, x + columnWidths[i] / 2, y + 5, { align: "center" }); // Adjusted vertical position
    x += columnWidths[i];
  });
  
  return y + 8; // Return the new Y position after headers (reduced height)
};

/**
 * Renders attendance data rows
 */
export const renderTableRows = (doc: jsPDF, sheetData: any[][], startY: number): number => {
  const columnWidths = [45, 25, 25, 25, 30, 30];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8); // Reduced font size for data rows to fit more content
  let y = startY;
  
  // Get actual data rows (skip headers and empty rows)
  const dataRows = sheetData.slice(2).filter(row => row.length > 0 && row[0] !== "");
  
  // Use all rows from data, not limited to 20 anymore
  dataRows.forEach((row, rowIndex) => {
    let x = 10;
    
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
        doc.rect(x, y, columnWidths[2] + columnWidths[3], 6); // Reduced height from 8 to 6
        doc.text("FOLGA", x + (columnWidths[2] + columnWidths[3]) / 2, y + 4, { align: "center" }); // Adjusted vertical position
        x += columnWidths[2] + columnWidths[3];
        return;
      }
      
      // Skip the clock out cell for FOLGA rows
      if (isFolga && cellIndex === 3) {
        return;
      }
      
      // Draw normal cell
      doc.rect(x, y, columnWidths[cellIndex], 6); // Reduced height from 8 to 6
      doc.text(cellText, x + columnWidths[cellIndex] / 2, y + 4, { align: "center" }); // Adjusted vertical position
      x += columnWidths[cellIndex];
    });
    
    y += 6; // Reduced row height from 8 to 6
  });
  
  return y; // Return the new Y position after rows
};

/**
 * Adds total hours and working days summary directly after the table
 */
export const addTotalsSummary = (doc: jsPDF, employeeReport: EmployeeReport, startY: number): number => {
  let y = startY + 3; // Reduced spacing
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9); // Consistent with headers
  
  // Add total working hours
  doc.text("TOTAL WORKING HOURS", 10, y + 4);
  
  // Format total work time correctly
  const totalHours = Math.floor(employeeReport.totalHours);
  const totalMinutes = Math.round((employeeReport.totalHours - totalHours) * 60);
  const formattedTotalTime = `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`;
  
  let x = 130;
  doc.rect(x, y, 30, 7); // Slightly reduced height
  doc.text(formattedTotalTime, x + 15, y + 4, { align: "center" });
  
  // Add working days
  y += 8; // Reduced spacing
  doc.text("WORKING DAYS", 10, y + 4);
  
  // Calculate working days
  const workingDays = employeeReport.workingDays.toString();
  x = 130;
  doc.rect(x, y, 30, 7); // Slightly reduced height
  doc.text(workingDays, x + 15, y + 4, { align: "center" });
  
  return y + 8; // Return the new Y position after totals
};
