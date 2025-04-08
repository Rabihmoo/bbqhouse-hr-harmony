import * as XLSX from "xlsx";
import { AttendanceReport, EmployeeReport } from "./types";
import { generateDeclarationText, generateSignatureText, getFormattedSignatureDate } from "./declarationGenerator";
import { formatTime } from "./timeCalculations";
import { ExportOptions } from "@/hooks/use-attendance-uploader";
import { sendEmailVia } from "./emailUtils";
import { createWorkbookSheet, downloadExcelFile, workbookToBlob, applyWorksheetStyling } from "./excelUtils";

// Function to export declarations for all employees
export const exportEmployeeDeclarations = async (
  reportData: AttendanceReport, 
  options: ExportOptions
): Promise<void> => {
  // Apply filters to employee reports
  let filteredReports = reportData.employeeReports;

  // Filter by department if specified
  if (options.filters.department) {
    const departments = options.filters.department.split(",");
    filteredReports = filteredReports.filter(emp => 
      departments.includes(emp.department)
    );
  }

  // Filter by branch if specified
  if (options.filters.branch) {
    const branches = options.filters.branch.split(",");
    filteredReports = filteredReports.filter(emp => 
      branches.includes(emp.company) || !branches.length
    );
  }

  // Filter by status (active only or all)
  if (options.filters.status === 'active') {
    // This would need to be adapted to your actual data structure
    // For now we'll include all employees since we don't have status info
  }

  // Filter by specific employees if specified
  if (options.filters.employees && options.filters.employees.length > 0) {
    filteredReports = filteredReports.filter(emp => 
      options.filters.employees?.includes(emp.employeeId)
    );
  }

  // Create a workbook for multiple sheets (one per employee)
  const workbook = XLSX.utils.book_new();
  
  // Process each employee
  for (const employeeReport of filteredReports) {
    // Create the declaration sheet for this employee
    const sheet = createEmployeeDeclarationSheet(
      employeeReport,
      reportData.month.toUpperCase(),
      reportData.year,
      options.includeSignature
    );
    
    // Add the sheet to the workbook
    const sheetName = employeeReport.employeeName.substring(0, 30).replace(/[*?:[\]\/\\]/g, "");
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    
    // If PDF export is required, generate a separate PDF for this employee
    if (options.format === 'pdf' || options.format === 'both') {
      await generatePdfForEmployee(employeeReport, reportData.month, reportData.year);
    }
    
    // Register the export in the employee record
    registerEmployeeExport(
      employeeReport, 
      reportData.month, 
      reportData.year, 
      options.format
    );
  }
  
  // Generate Excel file for all employees
  if (options.format === 'excel' || options.format === 'both') {
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Create download link for Excel
    downloadExcelFile(blob, `Employee_Declarations_${reportData.month}_${reportData.year}.xlsx`);
  }
  
  // If email delivery is enabled, send email with attachments
  if (options.sendEmail && options.emailAddress) {
    await sendDeclarationsViaEmail(
      options.emailAddress,
      reportData,
      filteredReports,
      options.format
    );
  }
};

// Create a single employee declaration sheet
export const createEmployeeDeclarationSheet = (
  employeeReport: EmployeeReport,
  month: string,
  year: string,
  includeSignature: boolean
): XLSX.WorkSheet => {
  // Create the full declaration title and text
  const declarationTitle = "DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS";
  const declarationText = generateDeclarationText(
    employeeReport.employeeName,
    employeeReport.biNumber,
    employeeReport.company,
    month,
    year
  );
  
  // Combine title and text for the merged cell
  const fullDeclarationText = `${declarationTitle}\n\n${declarationText}`;
  
  // Format the data with improved layout
  const rows = [];
  
  // Declaration text in a single row (will be merged)
  rows.push([fullDeclarationText]);
  
  // Table headers immediately after declaration
  rows.push(["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"]);
  
  const dataStartRow = 3; // Row index (1-based) where data starts (Row 3 is the first data row after headers)
  
  // Format attendance data
  employeeReport.attendanceRecords.forEach((record) => {
    // Calculate work time and extra hours based on clock values
    let workTime = record.workTime || '00:00';
    let extraHours = record.extraHours || '00:00';
    
    // Special handling for FOLGA
    if (record.clockIn === 'FOLGA' || record.clockOut === 'FOLGA') {
      workTime = '00:00';
      extraHours = '00:00';
    }
    // Handle missing clock values
    else if (!record.clockIn || !record.clockOut) {
      if (!record.clockIn && !record.clockOut) {
        workTime = '00:00';
      } else {
        workTime = '04:30';
      }
      extraHours = '00:00';
    }
    
    rows.push([
      employeeReport.employeeName,
      record.date,
      record.clockIn || '',
      record.clockOut || '',
      workTime,
      extraHours
    ]);
  });
  
  // Calculate data row range for formulas
  const dataEndRow = dataStartRow + employeeReport.attendanceRecords.length - 1;
  const workTimeCol = 'E'; // Column E is Work Time
  
  // Add formulas for totals
  // Add total work hours with SUM formula
  rows.push([
    "TOTAL WORKING HOURS", 
    "", 
    "", 
    "", 
    { f: `SUM(${workTimeCol}${dataStartRow}:${workTimeCol}${dataEndRow})`, z: '[h]:mm' },
    ""
  ]);
  
  // Add working days with COUNTIF formula - count rows where work time > 0
  rows.push([
    "WORKING DAYS", 
    "", 
    "", 
    "", 
    { f: `COUNTIF(${workTimeCol}${dataStartRow}:${workTimeCol}${dataEndRow},">0:00")` },
    ""
  ]);
  
  // Add empty row for spacing
  rows.push(["", "", "", "", "", ""]);
  
  // Add signature confirmation text - merged across all columns
  rows.push([generateSignatureText()]);
  
  // Add signature line
  rows.push([
    `Assinatura do Funcionário: ______________________________`, 
    "", 
    "", 
    "", 
    `Data: ${getFormattedSignatureDate()}`, 
    ""
  ]);
  
  // Create worksheet from rows
  const ws = XLSX.utils.aoa_to_sheet(rows);
  
  // Set column widths for better readability
  ws['!cols'] = [
    { wch: 25 }, // Name
    { wch: 12 }, // Date
    { wch: 10 }, // Clock In
    { wch: 10 }, // Clock Out
    { wch: 10 }, // Work Time
    { wch: 12 }  // EXTRA HOURS
  ];
  
  // Define merge cells
  const titleRow = 0;
  const totalsRow = dataEndRow + 1;
  const workingDaysRow = dataEndRow + 2;
  const spacingRow = dataEndRow + 3;
  const signatureTextRow = dataEndRow + 4;
  const signatureLineRow = dataEndRow + 5;
  
  ws['!merges'] = [
    // Declaration text across all columns (A1:F1)
    { s: { r: titleRow, c: 0 }, e: { r: titleRow, c: 5 } },
    
    // Signature text across all columns (after data)
    { s: { r: signatureTextRow, c: 0 }, e: { r: signatureTextRow, c: 5 } },
    
    // Signature line (left portion)
    { s: { r: signatureLineRow, c: 0 }, e: { r: signatureLineRow, c: 3 } },
  ];
  
  // Enable text wrapping for the declaration cell and set height
  const declarationCell = XLSX.utils.encode_cell({ r: titleRow, c: 0 });
  if (!ws[declarationCell].s) ws[declarationCell].s = {};
  ws[declarationCell].s.alignment = { wrapText: true, vertical: 'top' };
  
  // Set row height for declaration cell to fit the text
  if (!ws['!rows']) ws['!rows'] = [];
  ws['!rows'][titleRow] = { hpt: 180 }; // Set height to 180px for declaration text row
  
  // Set row height for signature text row
  ws['!rows'][signatureTextRow] = { hpt: 120 }; // Set height to 120px for signature text row
  
  // Apply borders and styling to all cells
  const range = XLSX.utils.decode_range(ws['!ref'] || "A1");
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell_address = XLSX.utils.encode_cell({ r, c });
      if (!ws[cell_address]) {
        // Create empty cell if it doesn't exist
        ws[cell_address] = { t: 's', v: '' };
      }
      
      // Add border style to all cells
      if (!ws[cell_address].s) ws[cell_address].s = {};
      ws[cell_address].s.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
      
      // Add bold style to title, header row, and totals
      if (r === 1 || r === totalsRow || r === workingDaysRow) {
        if (!ws[cell_address].s) ws[cell_address].s = {};
        ws[cell_address].s.font = { bold: true };
      }
      
      // Add background fill to header row
      if (r === 1) {
        ws[cell_address].s.fill = { fgColor: { rgb: "EEEEEE" } };
      }
      
      // Add text wrapping for signature text
      if (r === signatureTextRow) {
        if (!ws[cell_address].s) ws[cell_address].s = {};
        ws[cell_address].s.alignment = { wrapText: true, vertical: 'top' };
      }
    }
  }
  
  // Apply number format to work time column
  for (let r = dataStartRow; r <= dataEndRow; r++) {
    const cell_address = XLSX.utils.encode_cell({ r: r, c: 4 }); // Column E (index 4)
    if (ws[cell_address]) {
      if (!ws[cell_address].z) {
        ws[cell_address].z = '[h]:mm';
      }
    }
  }
  
  // Set formula cell to use time format
  const totalHoursCell = XLSX.utils.encode_cell({ r: totalsRow, c: 4 });
  if (ws[totalHoursCell]) {
    ws[totalHoursCell].z = '[h]:mm';
  }
  
  // Add AutoFilter for the header row
  ws['!autofilter'] = { ref: `A2:F2` };
  
  return ws;
};

// Generate PDF for a single employee (placeholder - would need a PDF library)
export const generatePdfForEmployee = async (
  employeeReport: EmployeeReport, 
  month: string, 
  year: string
): Promise<void> => {
  console.log(`PDF would be generated for ${employeeReport.employeeName} - ${month} ${year}`);
  
  return Promise.resolve();
};

// Register export in the employee's records
export const registerEmployeeExport = (
  employeeReport: EmployeeReport,
  month: string,
  year: string,
  format: 'excel' | 'pdf' | 'both'
): void => {
  const exportRecord = {
    id: `export-${Date.now()}-${employeeReport.employeeId}`,
    employeeId: employeeReport.employeeId,
    employeeName: employeeReport.employeeName,
    exportDate: new Date().toISOString(),
    month,
    year,
    totalHours: employeeReport.totalHours,
    workingDays: employeeReport.workingDays,
    format
  };
  
  // Get existing records
  const existingRecordsStr = localStorage.getItem('bbq-employee-exports') || '[]';
  const existingRecords = JSON.parse(existingRecordsStr);
  
  // Add new record
  existingRecords.push(exportRecord);
  
  // Save back to localStorage
  localStorage.setItem('bbq-employee-exports', JSON.stringify(existingRecords));
};

// Send declarations via email
export const sendDeclarationsViaEmail = async (
  email: string,
  reportData: AttendanceReport,
  filteredEmployees: EmployeeReport[],
  format: 'excel' | 'pdf' | 'both'
): Promise<void> => {
  // Calculate summary stats
  const totalEmployees = filteredEmployees.length;
  const totalHours = filteredEmployees.reduce((sum, emp) => sum + emp.totalHours, 0);
  const totalWorkingDays = filteredEmployees.reduce((sum, emp) => sum + emp.workingDays, 0);
  
  // Create email body
  const emailData = {
    to: email,
    subject: `Employee Declarations - ${reportData.month} ${reportData.year}`,
    body: `
      Please find attached the employee declarations for ${reportData.month} ${reportData.year}.
      
      Summary:
      - Total Employees: ${totalEmployees}
      - Total Working Hours: ${formatTime(totalHours)}
      - Total Working Days: ${totalWorkingDays}
      
      Format: ${format === 'both' ? 'Excel and PDF' : format.toUpperCase()}
      
      This is an automated email from the HR Management System.
    `,
    attachments: [`Employee_Declarations_${reportData.month}_${reportData.year}.xlsx`],
    metadata: {
      reportMonth: reportData.month,
      reportYear: reportData.year,
      employeeCount: totalEmployees
    }
  };
  
  // Send email using notification service
  await sendEmailVia('employee', emailData);
};
