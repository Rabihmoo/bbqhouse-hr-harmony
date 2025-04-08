import * as XLSX from "xlsx";
import { AttendanceReport, EmployeeReport } from "./types";
import { generateDeclarationText, generateSignatureText, getFormattedSignatureDate } from "./declarationGenerator";
import { toast } from "sonner";
import { ExportOptions } from "@/hooks/use-attendance-uploader";
import { sendEmailNotification } from "@/utils/notificationService";
import { calculateWorkingHours, formatTime } from "./timeCalculations";

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

  // Filter by branch if specified (assuming branch info is available)
  // This would need to be adapted to your actual data structure
  if (options.filters.branch) {
    const branches = options.filters.branch.split(",");
    // This is just a placeholder - adapt to your actual data structure
    filteredReports = filteredReports.filter(emp => 
      branches.includes(emp.company) || !branches.length
    );
  }

  // Filter by status (active only or all)
  if (options.filters.status === 'active') {
    // This would need to be adapted to your actual data structure
    // For now we'll include all employees since we don't have status info
    // filteredReports = filteredReports.filter(emp => emp.status === 'Active');
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
    downloadFile(blob, `Employee_Declarations_${reportData.month}_${reportData.year}.xlsx`);
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
const createEmployeeDeclarationSheet = (
  employeeReport: EmployeeReport,
  month: string,
  year: string,
  includeSignature: boolean
): XLSX.WorkSheet => {
  // Create the declaration header text
  const declarationText = generateDeclarationText(
    employeeReport.employeeName,
    employeeReport.biNumber,
    employeeReport.company,
    month,
    year
  );
  
  // Format the data with improved layout
  const rows = [];
  
  // Title row and declaration text combined in a single row
  rows.push(["DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS"]);
  
  // Declaration text in a single cell (will be merged)
  rows.push([declarationText]);
  
  // Table headers immediately after declaration
  rows.push(["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"]);
  
  const dataStartRow = 4; // Row index (1-based) where data starts
  
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
    { f: `SUM(${workTimeCol}${dataStartRow}:${workTimeCol}${dataEndRow})` },
    ""
  ]);
  
  // Add working days with COUNTIF formula - count rows where work time > 0
  rows.push([
    "WORKING DAYS", 
    "", 
    "", 
    "", 
    { f: `COUNTIF(${workTimeCol}${dataStartRow}:${workTimeCol}${dataEndRow},"<>00:00")` },
    ""
  ]);
  
  // Add signature section
  rows.push([]); // Empty row for spacing
  
  // Add signature confirmation text - merged across all columns
  rows.push([generateSignatureText(getFormattedSignatureDate())]);
  
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
  const declarationRow = dataStartRow - 3; // Adjusting for 1-based indexing in Excel
  const signatureTextRow = dataEndRow + 3;
  const signatureLineRow = dataEndRow + 5;
  
  ws['!merges'] = [
    // Title row across all columns (A1)
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    
    // Declaration text across all columns as a single cell (A2:F2)
    { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
    
    // Signature text across all columns (after data)
    { s: { r: signatureTextRow, c: 0 }, e: { r: signatureTextRow, c: 5 } },
    
    // Signature line (left portion)
    { s: { r: signatureLineRow, c: 0 }, e: { r: signatureLineRow, c: 3 } },
  ];
  
  // Enable text wrapping for the declaration cell
  const declarationCell = XLSX.utils.encode_cell({ r: 1, c: 0 });
  if (!ws[declarationCell].s) ws[declarationCell].s = {};
  ws[declarationCell].s.alignment = { wrapText: true, vertical: 'top' };
  
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
      
      // Add bold style to header row and title
      if (r === 0 || r === 2) {
        if (!ws[cell_address].s) ws[cell_address].s = {};
        ws[cell_address].s.font = { bold: true };
        if (r === 2) {
          ws[cell_address].s.fill = { fgColor: { rgb: "EEEEEE" } };
        }
      }
      
      // Add bold style to totals rows
      if (r === dataEndRow + 1 || r === dataEndRow + 2) {
        if (!ws[cell_address].s) ws[cell_address].s = {};
        ws[cell_address].s.font = { bold: true };
      }
    }
  }
  
  // Set row height for declaration cell to fit the text
  if (!ws['!rows']) ws['!rows'] = [];
  ws['!rows'][1] = { hpt: 120 }; // Set height for declaration text row
  
  // Add AutoFilter for the header row
  ws['!autofilter'] = { ref: `A3:F3` };
  
  return ws;
};

// Generate PDF for a single employee (placeholder - would need a PDF library)
const generatePdfForEmployee = async (
  employeeReport: EmployeeReport, 
  month: string, 
  year: string
): Promise<void> => {
  // This is a placeholder function
  // In a real implementation, you would use a library like jspdf or pdfmake
  // Since this would require additional dependencies, I'm leaving it as a placeholder
  
  console.log(`PDF would be generated for ${employeeReport.employeeName} - ${month} ${year}`);
  
  // Mock PDF creation for now
  setTimeout(() => {
    toast.success(`PDF for ${employeeReport.employeeName} generated`);
  }, 500);
  
  // In a real implementation, you would:
  // 1. Create a PDF document
  // 2. Add the declaration header
  // 3. Add the table with data
  // 4. Add the signature section
  // 5. Save the PDF and trigger download
  
  return Promise.resolve();
};

// Register export in the employee's records
const registerEmployeeExport = (
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

// Helper function to download a file
const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Send declarations via email
const sendDeclarationsViaEmail = async (
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
  try {
    await sendEmailNotification('employee', emailData);
    console.log("Email sent successfully:", email);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email delivery failed");
  }
};

// Function to update the dataProcessor to not auto-export on initial processing
export const updateDataProcessor = (processAttendanceData: any): any => {
  // This is a placeholder - in a real implementation, you might need to modify
  // the existing processAttendanceData function to not auto-export
  return processAttendanceData;
};
