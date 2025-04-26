
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
  
  // Set row heights - but NEVER for row 2 (index 1)
  ws["!rows"] = [];
  
  // Declaration title row - normal height
  ws["!rows"][0] = { hpt: 30 };
  
  // CRITICAL: We deliberately do NOT set a height for row 2 (index 1)
  // This allows Excel to auto-size the row based on content and text wrapping
  
  // Apply enhanced styles with better text wrapping
  applyDeclarationStyles(ws, employeeReport.attendanceRecords.length + 10);
  
  // Enhanced handling for all cells in row 2 to ensure text wrapping works across Excel versions
  for (let c = 0; c <= 5; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c });
    if (ws[cellAddress]) {
      // Make sure we have a style object
      if (!ws[cellAddress].s) ws[cellAddress].s = {};
      
      // Force text wrapping with comprehensive settings
      ws[cellAddress].s.alignment = {
        wrapText: true,
        vertical: 'top',
        horizontal: 'left',
        indent: 1,
        readingOrder: 2,
        shrinkToFit: false
      };
      
      // Set text format
      ws[cellAddress].z = '@';
      
      // Set string type
      ws[cellAddress].t = 's';
      
      // Add HTML formatting for better wrapping in Excel
      if (ws[cellAddress].v && typeof ws[cellAddress].v === 'string') {
        ws[cellAddress].h = ws[cellAddress].v.replace(/\n/g, '<br>');
        
        // Add rich text format for better handling
        ws[cellAddress].r = [{
          t: ws[cellAddress].v,
          s: { font: { name: "Calibri", sz: 11 } }
        }];
      }
    }
  }
  
  // Set the worksheet reference range
  const lastRow = includeSignature ? 9 + employeeReport.attendanceRecords.length : 6 + employeeReport.attendanceRecords.length;
  ws['!ref'] = XLSX.utils.encode_range(
    { r: 0, c: 0 },
    { r: lastRow, c: 5 }
  );
  
  return ws;
};
