
import { jsPDF } from "jspdf";
import { EmployeeReport } from "../types";

/**
 * Adds the totals section to the PDF document
 */
export const addPdfTotals = (
  doc: jsPDF,
  employeeReport: EmployeeReport,
  startY: number
): number => {
  let y = startY + 5;
  
  // Add totals
  // Use setFont instead of setFontStyle
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL WORKING HOURS", 10, y + 5);
  
  // Use totalHours string directly
  let x = 130;
  doc.rect(x, y, 30, 8);
  doc.text(employeeReport.totalHours, x + 15, y + 5, { align: "center" });
  
  // Add working days
  y += 10;
  doc.text("WORKING DAYS", 10, y + 5);
  
  // Calculate working days
  const workingDays = employeeReport.workingDays.toString();
  x = 130;
  doc.rect(x, y, 30, 8);
  doc.text(workingDays, x + 15, y + 5, { align: "center" });

  return y;
};
