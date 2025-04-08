
import { EmployeeReport } from "../types";

/**
 * Register export in the employee's records
 */
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
