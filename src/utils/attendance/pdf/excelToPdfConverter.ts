
import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import { createEmployeeDeclarationSheet } from "../excel/declarationSheetBuilder";
import { ExcelToJSON } from "../excelUtils";

/**
 * Prepares Excel workbook from employee report data
 */
export const prepareWorkbookFromEmployeeReport = (
  employeeReport: EmployeeReport, 
  month: string, 
  year: string
): XLSX.WorkBook => {
  // Create a workbook with a single sheet
  const workbook = XLSX.utils.book_new();
  
  // Create the declaration sheet
  const sheet = createEmployeeDeclarationSheet(
    employeeReport,
    month.toUpperCase(),
    year,
    true // Include signature
  );
  
  // Add the sheet to the workbook
  const sheetName = employeeReport.employeeName.substring(0, 30).replace(/[*?:[\]\/\\]/g, "");
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  
  return workbook;
};

/**
 * Extracts declaration text from Excel data
 */
export const extractDeclarationText = (sheetData: any[][]): string => {
  // Extract the declaration text without the title
  return sheetData[0][0].replace("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS\n\n", "");
};

/**
 * Converts Excel workbook to structured data for PDF generation
 */
export const convertWorkbookToData = (workbook: XLSX.WorkBook): any[][] => {
  // Convert Excel to JSON data
  const jsonData = ExcelToJSON(workbook);
  
  // Extract data from first sheet
  return jsonData[0].data;
};
