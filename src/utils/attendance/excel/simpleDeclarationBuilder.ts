
import * as XLSX from "xlsx";
import { EmployeeReport } from "../types";
import { generateDeclarationText, generateSignatureText, getFormattedSignatureDate } from "../declarationGenerator";

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
  const ws = XLSX.utils.aoa_to_sheet([[""]]);
  
  // Define all content as array of arrays (rows and columns)
  const content: any[][] = [];
  
  // Row 0: Title
  content[0] = ["DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS", "", "", "", "", ""];
  
  // Row 1: Declaration text (will be merged later)
  const declarationText = generateDeclarationText(
    employeeReport.employeeName,
    employeeReport.biNumber || "",
    employeeReport.company,
    month,
    year
  );
  content[1] = [declarationText, "", "", "", "", ""];
  
  // Add empty rows to ensure spacing
  content[2] = ["", "", "", "", "", ""];
  
  // Row 3: Headers
  content[3] = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
  
  // Rows 4+: Attendance records
  let rowIndex = 4;
  employeeReport.attendanceRecords.forEach(record => {
    if (record.status === "FOLGA" || record.clockIn === "FOLGA") {
      // FOLGA row
      content[rowIndex] = [
        employeeReport.employeeName,
        record.date,
        "FOLGA", 
        "", 
        "00:00", 
        "00:00"
      ];
    } else {
      // Normal day
      content[rowIndex] = [
        employeeReport.employeeName,
        record.date,
        record.clockIn || "",
        record.clockOut || "",
        record.workTime || "00:00",
        record.extraHours || "00:00"
      ];
    }
    rowIndex++;
  });
  
  // Total hours row
  content[rowIndex] = [
    "TOTAL WORKING HOURS", "", "", "",
    employeeReport.totalHours || "00:00",
    employeeReport.extraHours || "00:00"
  ];
  rowIndex++;
  
  // Working days row
  content[rowIndex] = [
    "WORKING DAYS", "", "", "",
    employeeReport.workingDays.toString(),
    ""
  ];
  rowIndex++;
  
  // Empty row
  content[rowIndex] = ["", "", "", "", "", ""];
  rowIndex++;
  
  // Signature section if needed
  if (includeSignature) {
    // Signature text
    content[rowIndex] = [generateSignatureText(), "", "", "", "", ""];
    rowIndex++;
    
    // Empty row
    content[rowIndex] = ["", "", "", "", "", ""];
    rowIndex++;
    
    // Signature line
    const formattedDate = getFormattedSignatureDate();
    content[rowIndex] = [
      `Assinatura do Funcionário: _____________________________          Data: ${formattedDate}`,
      "", "", "", "", ""
    ];
    rowIndex++;
  }
  
  // Convert content to worksheet
  ws = XLSX.utils.aoa_to_sheet(content);
  
  // Define merges
  const merges = [
    // Title row
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    
    // Declaration text
    { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
    
    // Total hours label
    { s: { r: 4 + employeeReport.attendanceRecords.length, c: 0 }, 
      e: { r: 4 + employeeReport.attendanceRecords.length, c: 3 } },
    
    // Working days label
    { s: { r: 5 + employeeReport.attendanceRecords.length, c: 0 }, 
      e: { r: 5 + employeeReport.attendanceRecords.length, c: 3 } },
  ];
  
  // Signature section merges
  if (includeSignature) {
    // Signature text
    merges.push({
      s: { r: 7 + employeeReport.attendanceRecords.length, c: 0 },
      e: { r: 7 + employeeReport.attendanceRecords.length, c: 5 }
    });
    
    // Signature line
    merges.push({
      s: { r: 9 + employeeReport.attendanceRecords.length, c: 0 },
      e: { r: 9 + employeeReport.attendanceRecords.length, c: 5 }
    });
  }
  
  // Add FOLGA merges for any FOLGA records
  employeeReport.attendanceRecords.forEach((record, index) => {
    if (record.status === "FOLGA" || record.clockIn === "FOLGA") {
      merges.push({
        s: { r: 4 + index, c: 2 }, // Clock In cell
        e: { r: 4 + index, c: 3 }  // Clock Out cell
      });
    }
  });
  
  // Apply merges
  ws["!merges"] = merges;
  
  // Set column widths
  ws["!cols"] = [
    { wch: 40 }, // Name (A) - wider for text
    { wch: 15 }, // Date (B)
    { wch: 15 }, // Clock In (C)
    { wch: 15 }, // Clock Out (D)
    { wch: 15 }, // Work Time (E)
    { wch: 15 }  // Extra Hours (F)
  ];
  
  // Set row heights
  ws["!rows"] = [];
  
  // Declaration text needs much more height
  ws["!rows"][1] = { hpt: 150 }; // Declaration text (150 points tall)
  
  // Apply styles
  applySimpleStyles(ws, employeeReport.attendanceRecords.length + 10);
  
  // Set the worksheet reference range
  const lastRow = includeSignature ? 9 + employeeReport.attendanceRecords.length : 6 + employeeReport.attendanceRecords.length;
  ws['!ref'] = XLSX.utils.encode_range(
    { r: 0, c: 0 },
    { r: lastRow, c: 5 }
  );
  
  return ws;
};

/**
 * Apply simple styling to the worksheet
 */
const applySimpleStyles = (
  ws: XLSX.WorkSheet,
  maxRow: number
): void => {
  // Process all cells
  for (let r = 0; r <= maxRow; r++) {
    for (let c = 0; c <= 5; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      
      // Skip if cell doesn't exist
      if (!ws[cellAddress]) continue;
      
      // Create style object if it doesn't exist
      if (!ws[cellAddress].s) ws[cellAddress].s = {};
      
      // Default font
      ws[cellAddress].s.font = {
        name: "Calibri",
        sz: 11
      };
      
      // Default borders
      ws[cellAddress].s.border = {
        top: { style: "thin", color: { auto: 1 } },
        bottom: { style: "thin", color: { auto: 1 } },
        left: { style: "thin", color: { auto: 1 } },
        right: { style: "thin", color: { auto: 1 } }
      };
      
      // Special formatting for title row
      if (r === 0) {
        ws[cellAddress].s.font.bold = true;
        ws[cellAddress].s.font.sz = 14;
        ws[cellAddress].s.alignment = {
          horizontal: "center",
          vertical: "center"
        };
      }
      
      // Special formatting for declaration text
      if (r === 1) {
        ws[cellAddress].s.alignment = {
          wrapText: true,
          vertical: "top",
          horizontal: "left"
        };
        // Critical: set cell format to text
        ws[cellAddress].z = "@";
      }
      
      // Header row
      if (r === 3) {
        ws[cellAddress].s.font.bold = true;
        ws[cellAddress].s.alignment = {
          horizontal: "center",
          vertical: "center"
        };
        ws[cellAddress].s.fill = {
          fgColor: { rgb: "EEEEEE" },
          patternType: "solid"
        };
      }
      
      // FOLGA cell
      if (ws[cellAddress].v === "FOLGA") {
        ws[cellAddress].s.font.bold = true;
        ws[cellAddress].s.alignment = {
          horizontal: "center",
          vertical: "center"
        };
        ws[cellAddress].s.fill = {
          fgColor: { rgb: "FEF7CD" },
          patternType: "solid"
        };
      }
      
      // Total row and Working days row
      if (cellAddress.includes("A") && (
          ws[cellAddress].v === "TOTAL WORKING HOURS" || 
          ws[cellAddress].v === "WORKING DAYS")) {
        ws[cellAddress].s.font.bold = true;
        ws[cellAddress].s.alignment = {
          horizontal: "right",
          vertical: "center"
        };
      }
      
      // Center align data cells
      if (r >= 4 && r <= maxRow && c >= 1 && c <= 5) {
        ws[cellAddress].s.alignment = {
          horizontal: "center",
          vertical: "center"
        };
      }
      
      // Signature section
      if (r >= maxRow - 3 && cellAddress.includes("A") && 
          typeof ws[cellAddress].v === "string" && 
          ws[cellAddress].v.includes("Assinatura")) {
        ws[cellAddress].s.font.bold = true;
      }
    }
  }
};

export default createSimpleDeclarationSheet;
