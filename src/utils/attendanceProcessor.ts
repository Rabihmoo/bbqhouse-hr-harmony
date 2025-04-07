
// This file now serves as an export hub for better organization
import { formatTime, calculateWorkingHours } from "./attendance/timeCalculations";
import { formatDateToPortuguese } from "./attendance/dateFormatter";
import { processAttendanceData } from "./attendance/dataProcessor";
import { generateDeclarationText, generateSignatureText } from "./attendance/declarationGenerator";
import { EmployeeAttendanceRecord, EmployeeReport, AttendanceReport } from "./attendance/types";

// Re-export everything for backward compatibility
export {
  formatTime,
  calculateWorkingHours,
  formatDateToPortuguese,
  processAttendanceData,
  generateDeclarationText,
  generateSignatureText,
  EmployeeAttendanceRecord,
  EmployeeReport,
  AttendanceReport
};
