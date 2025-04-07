
import { format } from "date-fns";
import { employees } from "@/lib/data";
import { calculateWorkingHours } from "./timeCalculations";
import { AttendanceReport, EmployeeAttendanceRecord, EmployeeReport } from "./types";
import * as XLSX from "xlsx";

export const processAttendanceData = (file: File): Promise<AttendanceReport> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to JSON
        const rows = XLSX.utils.sheet_to_json(worksheet);
        
        // Get current date information
        const currentDate = new Date();
        const months = [
          "janeiro", "fevereiro", "março", "abril",
          "maio", "junho", "julho", "agosto",
          "setembro", "outubro", "novembro", "dezembro"
        ];
        const month = months[currentDate.getMonth()];
        const year = currentDate.getFullYear().toString();
        
        // Process employee data from the rows
        const employeeRecords = new Map<string, { 
          name: string, 
          records: EmployeeAttendanceRecord[],
          totalHours: number,
          extraHours: number,
          workingDays: number
        }>();
        
        // Process each row in the Excel file
        rows.forEach((row: any) => {
          // This is just an example - adjust based on your actual Excel structure
          const employeeName = row.Name || row.Employee || row.EmployeeName;
          const employeeId = row.ID || row.EmployeeID || employeeName;
          const date = row.Date;
          let clockIn = row.ClockIn || row["Clock In"];
          let clockOut = row.ClockOut || row["Clock Out"];
          
          // Apply data rules
          if (!clockIn && !clockOut) {
            clockIn = "FOLGA";
            clockOut = "";
          } else if (!clockIn) {
            clockIn = "nao entrada";
          } else if (!clockOut) {
            clockOut = "nao saida";
          }
          
          // Calculate working hours and extra hours
          const { workTime, extraHours } = calculateWorkingHours(clockIn, clockOut);
          
          // Convert time to numeric values for totaling
          const workTimeParts = workTime.split(':').map(Number);
          const extraHoursParts = extraHours.split(':').map(Number);
          const workTimeHours = workTimeParts[0] + (workTimeParts[1] / 60);
          const extraHoursTime = extraHoursParts[0] + (extraHoursParts[1] / 60);
          
          // Check if we already have records for this employee
          if (!employeeRecords.has(employeeId)) {
            employeeRecords.set(employeeId, { 
              name: employeeName, 
              records: [], 
              totalHours: 0, 
              extraHours: 0,
              workingDays: 0
            });
          }
          
          // Add to the employee's records
          const employeeData = employeeRecords.get(employeeId)!;
          
          employeeData.records.push({
            date: format(new Date(date), 'MM/dd/yyyy'),
            clockIn,
            clockOut,
            workTime,
            extraHours
          });
          
          employeeData.totalHours += workTimeHours;
          employeeData.extraHours += extraHoursTime;
          if (workTimeHours > 0) {
            employeeData.workingDays += 1;
          }
        });
        
        // Generate the final report structure
        const employeeReports: EmployeeReport[] = [];
        
        employeeRecords.forEach((data, id) => {
          // Find employee in our system to get additional information
          const employeeInfo = employees.find(e => 
            e.fullName === data.name || e.id === id || e.fullName.toLowerCase().includes(data.name.toLowerCase())
          );
          
          employeeReports.push({
            employeeId: id,
            employeeName: data.name,
            biNumber: employeeInfo?.biNumber || "000000000",
            department: employeeInfo?.department || "Not specified",
            company: employeeInfo?.company || "MYR HR Management",
            workingDays: data.workingDays,
            totalHours: Math.round(data.totalHours * 10) / 10,
            extraHours: Math.round(data.extraHours * 10) / 10,
            attendanceRecords: data.records
          });
        });
        
        const report: AttendanceReport = {
          reportDate: new Date().toISOString(),
          month,
          year,
          employeeReports
        };
        
        resolve(report);
        
      } catch (error) {
        console.error("Error processing attendance data:", error);
        reject(new Error("Failed to process attendance data file"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read the file"));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
