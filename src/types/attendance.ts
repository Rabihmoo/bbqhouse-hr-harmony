
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes?: string;
  biNumber?: string;
  department?: string;
  company?: string;
}

export interface NewAttendance {
  employeeId: string;
  date: Date;
  clockIn: string;
  clockOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes: string;
}

export interface EmployeeReport {
  employeeName: string;
  employeeId: string;
  biNumber: string;
  department: string;
  company: string;
  totalHours: number;
  workingDays: number;
  extraHours: number;
  attendanceRecords: any[];
  // Optional fields that might be passed from other functions
  month?: string;
  year?: string;
  sheetData?: any[][];
}
