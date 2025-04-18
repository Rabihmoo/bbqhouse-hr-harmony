
import * as XLSX from "xlsx";
import { EmployeeReport } from "../../types";
import { prepareWorksheetContent } from "./contentPreparation";
import { applyDeclarationStyles } from "./stylingUtils";
import { applySpecialMerges, addFolgaMerges } from "./mergeUtils";

/**
 * Creates a simple employee declaration sheet with reliable text wrapping
 */
export const createSimpleDeclarationSheet = (
  employeeReport: EmployeeReport,
  month: string,
  year: string,
  includeSignature: boolean = true
): XLSX.WorkSheet => {
  // Create empty worksheet
  let ws = XLSX.utils.aoa_to_sheet([[""]]);
  
  // Generate the content array with all necessary rows
  const content = prepareWorksheetContent(
    employeeReport,
    month,
    year,
    includeSignature
  );
  
  // Convert content to worksheet
  ws = XLSX.utils.aoa_to_sheet(content);
  
  // Define merges
  const merges = applySpecialMerges(
    employeeReport.attendanceRecords.length,
    includeSignature
  );
  
  // Apply merges to worksheet
  ws["!merges"] = merges;
  
  // Process FOLGA entries to add merges for them
  addFolgaMerges(ws, employeeReport.attendanceRecords.length);
  
  // Set column widths with better distribution for text wrapping
  ws["!cols"] = [
    { wch: 50 }, // Name (A) - wider for text
    { wch: 15 }, // Date (B)
    { wch: 15 }, // Clock In (C)
    { wch: 15 }, // Clock Out (D)
    { wch: 15 }, // Work Time (E)
    { wch: 15 }  // Extra Hours (F)
  ];
  
  // Set row heights - but focus on declaration text row height
  ws["!rows"] = [];
  
  // Declaration text needs appropriate height - not too much, not too little
  ws["!rows"][1] = { hpt: 300 }; // Declaration text with reasonable height for wrapped text
  
  // Apply enhanced styles with better text wrapping
  applyDeclarationStyles(ws, employeeReport.attendanceRecords.length + 10);
  
  // Set the worksheet reference range
  const lastRow = includeSignature ? 9 + employeeReport.attendanceRecords.length : 6 + employeeReport.attendanceRecords.length;
  ws['!ref'] = XLSX.utils.encode_range(
    { r: 0, c: 0 },
    { r: lastRow, c: 5 }
  );
  
  // Force the first row to be visible with proper height
  if (!ws['!rows'][0]) ws['!rows'][0] = { hpt: 30 };
  
  return ws;
};
