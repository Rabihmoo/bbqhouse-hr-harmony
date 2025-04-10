
// Add explicit export keywords to each interface

export interface EmployeeAttendanceRecord {
  date: string;
  clockIn: string;
  clockOut: string;
  workTime: string;
  extraHours: string;
  status?: string;
}

export interface EmployeeReport {
  employeeId: string;
  employeeName: string;
  biNumber: string;
  department: string;
  company: string;
  workingDays: number;
  totalHours: number;
  extraHours: number;
  totalExtraHours?: string;
  attendanceRecords: EmployeeAttendanceRecord[];
}

export interface AttendanceReport {
  reportDate: string;
  month: string;
  year: string;
  employeeReports: EmployeeReport[];
}
