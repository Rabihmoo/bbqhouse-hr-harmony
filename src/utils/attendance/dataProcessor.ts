
import { format } from "date-fns";
import { employees } from "@/lib/data";
import { calculateWorkingHours, formatTime } from "./timeCalculations";
import { AttendanceReport, EmployeeAttendanceRecord, EmployeeReport } from "./types";

export const processAttendanceData = (fileData: any): AttendanceReport => {
  // In a real implementation, this would parse the Excel file
  // For now, we'll simulate the data processing
  
  const currentDate = new Date();
  const months = [
    "janeiro", "fevereiro", "março", "abril",
    "maio", "junho", "julho", "agosto",
    "setembro", "outubro", "novembro", "dezembro"
  ];
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear().toString();
  
  try {
    // Generate reports per employee
    const employeeReports = employees.map(employee => {
      // Generate random attendance records for simulation
      const daysInMonth = 20;
      const attendanceRecords: EmployeeAttendanceRecord[] = [];
      let totalWorkHours = 0;
      let totalExtraHours = 0;
      let workingDays = 0;
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (date > currentDate) continue; // Don't generate future dates
        
        // Generate random attendance
        const rand = Math.random();
        let clockIn = "";
        let clockOut = "";
        
        if (rand < 0.05) {
          // Absence (FOLGA)
          clockIn = "FOLGA";
          clockOut = "";
        } else if (rand < 0.10) {
          // No entrance
          clockIn = "nao entrada";
          clockOut = "17:00";
        } else if (rand < 0.15) {
          // No exit
          clockIn = "08:00";
          clockOut = "nao saida";
        } else {
          // Regular day with random variation
          const hour = 8 + Math.floor(Math.random() * 2);
          const minute = Math.floor(Math.random() * 60);
          clockIn = `0${hour}:${minute < 10 ? '0' + minute : minute}`;
          
          const outHour = 16 + Math.floor(Math.random() * 4);
          const outMinute = Math.floor(Math.random() * 60);
          clockOut = `${outHour}:${outMinute < 10 ? '0' + outMinute : outMinute}`;
        }
        
        // Calculate work time and extra hours
        const { workTime, extraHours } = calculateWorkingHours(clockIn, clockOut);
        
        // Convert HH:MM to hours for totaling
        const workTimeParts = workTime.split(':').map(Number);
        const extraHoursParts = extraHours.split(':').map(Number);
        
        const workTimeHours = workTimeParts[0] + workTimeParts[1] / 60;
        const extraHoursTime = extraHoursParts[0] + extraHoursParts[1] / 60;
        
        totalWorkHours += workTimeHours;
        totalExtraHours += extraHoursTime;
        
        if (workTimeHours > 0) {
          workingDays++;
        }
        
        attendanceRecords.push({
          date: format(date, 'MM/dd/yyyy'),
          clockIn,
          clockOut,
          workTime,
          extraHours
        });
      }
      
      return {
        employeeId: employee.id,
        employeeName: employee.fullName,
        biNumber: employee.biNumber || "000000000",
        department: employee.department || "Not specified",
        company: employee.company || "MYR HR Management",
        workingDays,
        totalHours: Math.round(totalWorkHours * 10) / 10,
        extraHours: Math.round(totalExtraHours * 10) / 10,
        attendanceRecords
      };
    });
    
    return {
      reportDate: new Date().toISOString(),
      month,
      year,
      employeeReports
    };
  } catch (error) {
    console.error("Error processing attendance data:", error);
    throw new Error("Failed to process attendance data");
  }
};
