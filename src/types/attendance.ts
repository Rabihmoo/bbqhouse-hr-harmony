
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
  month: string;
  year: string;
  totalHours: number;
  workingDays: number;
  sheetData: any[][];
}
