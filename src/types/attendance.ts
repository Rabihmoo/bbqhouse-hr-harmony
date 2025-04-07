
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
}

export interface NewAttendance {
  employeeId: string;
  date: Date;
  clockIn: string;
  clockOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes: string;
}
