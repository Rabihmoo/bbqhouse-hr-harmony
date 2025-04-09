
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { EmployeeReport } from "../types";
import { ExcelToJSON } from "../excelUtils";
import { createEmployeeDeclarationSheet } from "../excel/declarationSheetBuilder";
import { 
  renderPdfTitle, 
  renderDeclarationText, 
  renderTableHeaders, 
  renderTotalsSection, 
  renderSignatureSection 
} from "./pdfLayout";
import { renderAttendanceTable } from "./pdfTableRenderer";

/**
 * Convert employee report data to a PDF document
 */
export const convertEmployeeReportToPdf = async (
  employeeReport: EmployeeReport,
  month: string,
  year: string
): Promise<jsPDF> => {
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
  
  // Generate PDF using jsPDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Convert Excel to JSON data
  const jsonData = ExcelToJSON(workbook);
  
  // Extract data from first sheet
  const sheetData = jsonData[0].data;
  
  // Render the title (centered)
  renderPdfTitle(doc);
  
  // Extract declaration text (without the title)
  const declarationText = sheetData[0][0].replace("DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS\n\n", "");
  
  // Render declaration text with proper alignment and get the height
  const textHeight = renderDeclarationText(doc, declarationText);
  
  // Create table with proper positioning after the text
  const startY = 35 + textHeight + 10; // 10mm margin after text
  
  // Render table headers and get next Y position
  let currentY = renderTableHeaders(doc, startY);
  
  // Render table content and get next Y position
  currentY = renderAttendanceTable(doc, sheetData, currentY);
  
  // Render totals section
  currentY = renderTotalsSection(
    doc, 
    currentY, 
    employeeReport.totalHours, 
    employeeReport.workingDays
  );
  
  // Render signature section
  renderSignatureSection(doc, currentY + 10);
  
  return doc;
};
