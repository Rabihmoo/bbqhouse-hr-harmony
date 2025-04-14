
import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import { generateDeclarationText, getFormattedSignatureDate } from "../declarationGenerator";
import { createWorksheetBase } from "./worksheetBaseBuilder";
import { setDeclarationContent } from "./declarationContentBuilder";
import { addEmployeeAttendanceRecords } from "./attendanceRecordsBuilder";
import { addTotalsRows } from "./totalsRowBuilder";
import { addSignatureSection } from "./signatureSectionBuilder";
import { applyFinalFormatting } from "./worksheetFinalFormatting";

/**
 * Creates a single employee declaration sheet with improved formatting
 */
export const createEmployeeDeclarationSheet = (
  employeeReport: EmployeeReport,
  month: string,
  year: string,
  includeSignature: boolean
): XLSX.WorkSheet => {
  // Create base worksheet
  const ws = createWorksheetBase();
  
  // Define important row indices
  const rowIndices = {
    declarationRow: 0,
    spacerRow: 2, // Increased to account for declaration title and text being separate
    headerRow: 3,
    dataStartRow: 4,
    dataEndRow: 4 + employeeReport.attendanceRecords.length - 1,
    totalsRow: 0, // Will be calculated later
    workingDaysRow: 0, // Will be calculated later
    signatureTextRow: 0, // Will be calculated later if needed
    signatureLineRow: 0 // Will be calculated later if needed
  };
  
  // Update calculated rows
  rowIndices.totalsRow = rowIndices.dataEndRow + 1;
  rowIndices.workingDaysRow = rowIndices.totalsRow + 1;
  if (includeSignature) {
    rowIndices.signatureTextRow = rowIndices.workingDaysRow + 2;
    rowIndices.signatureLineRow = rowIndices.signatureTextRow + 1;
  }
  
  // Generate declaration title and text
  const declarationTitle = "DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS";
  const declarationText = generateDeclarationText(
    employeeReport.employeeName,
    employeeReport.biNumber || "",
    employeeReport.company,
    month,
    year
  );
  const fullText = `${declarationTitle}\n\n${declarationText}`;
  
  // Set declaration content with improved formatting
  setDeclarationContent(ws, fullText, rowIndices.declarationRow);
  
  // Add employee attendance records
  const merges = addEmployeeAttendanceRecords(ws, employeeReport, rowIndices);
  
  // Add totals rows with proper formatting
  addTotalsRows(ws, employeeReport, rowIndices);
  
  // Add signature section if needed
  if (includeSignature) {
    const signatureMerges = addSignatureSection(ws, rowIndices);
    merges.push(...signatureMerges);
  }
  
  // Apply final comprehensive formatting with more reasonable settings
  const lastRow = includeSignature ? rowIndices.signatureLineRow : rowIndices.workingDaysRow;
  applyFinalFormatting(ws, merges, lastRow, rowIndices);
  
  // Ensure no protection is set
  delete ws['!protect'];
  
  return ws;
};
