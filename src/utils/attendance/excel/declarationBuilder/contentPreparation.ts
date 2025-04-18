
import { EmployeeReport } from "../../types";
import { generateDeclarationText, generateSignatureText, getFormattedSignatureDate } from "../../declarationGenerator";

/**
 * Prepares the content array for the declaration sheet
 */
export const prepareWorksheetContent = (
  employeeReport: EmployeeReport, 
  month: string, 
  year: string,
  includeSignature: boolean
): any[][] => {
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
  
  // Format declaration text for Excel (will be styled for wrapping)
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
  
  return content;
};
