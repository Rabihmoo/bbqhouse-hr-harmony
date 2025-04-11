
// Add explicit export keywords to each interface

export interface EmployeeAttendanceRecord {
  date: string;
  clockIn: string;
  clockOut: string;
  workTime: string;
  extraHours: string;
  status?: string; // Can be "FOLGA" or other statuses
}

export interface EmployeeReport {
  employeeId: string;
  employeeName: string;
  biNumber: string;
  department: string;
  company: string;
  workingDays: number;
  totalHours: string;  // Changed to string to match expected format
  extraHours: string;  // Changed to string to match expected format
  totalExtraHours?: string;
  attendanceRecords: EmployeeAttendanceRecord[];
}

export interface AttendanceReport {
  reportDate: string;
  month: string;
  year: string;
  employeeReports: EmployeeReport[];
}
