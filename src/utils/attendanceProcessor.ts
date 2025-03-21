
import { employees } from "@/lib/data";

export interface EmployeeAttendanceRecord {
  date: string;
  clockIn: string;
  clockOut: string;
  workTime: string;
}

export interface EmployeeReport {
  employeeId: string;
  employeeName: string;
  biNumber: string;
  department: string;
  workingDays: number;
  totalHours: number;
  extraHours: number;
  attendanceRecords: EmployeeAttendanceRecord[];
}

export interface AttendanceReport {
  reportDate: string;
  employeeReports: EmployeeReport[];
}

export const processAttendanceData = (fileData: any): AttendanceReport => {
  // Simulating the Python script functionality
  try {
    // Generate reports per employee
    const employeeReports = employees.map(employee => {
      // Generate random attendance data
      const workingDays = Math.floor(Math.random() * 10) + 15; // 15-25 working days
      const totalHours = workingDays * 8 + Math.floor(Math.random() * 20); // Some extra hours
      const extraHours = Math.max(0, totalHours - (workingDays * 8));
      
      return {
        employeeId: employee.id,
        employeeName: employee.fullName,
        biNumber: employee.biNumber,
        department: employee.department,
        workingDays,
        totalHours,
        extraHours,
        attendanceRecords: Array(workingDays).fill(0).map((_, index) => {
          const date = new Date();
          date.setDate(date.getDate() - index);
          const clockIn = `0${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60)}`;
          const clockOut = `${17 + Math.floor(Math.random() * 3)}:${Math.floor(Math.random() * 60)}`;
          return {
            date: date.toISOString().split('T')[0],
            clockIn,
            clockOut,
            workTime: "8:00"
          };
        })
      };
    });
    
    return {
      reportDate: new Date().toISOString(),
      employeeReports
    };
  } catch (error) {
    console.error("Error processing attendance data:", error);
    throw new Error("Failed to process attendance data");
  }
};
