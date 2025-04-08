
import { format } from "date-fns";
import { employees } from "@/lib/data";
import { calculateWorkingHours, formatTime } from "./timeCalculations";
import { AttendanceReport, EmployeeAttendanceRecord, EmployeeReport } from "./types";
import * as XLSX from "xlsx";

export const processAttendanceData = (file: File, autoExport: boolean = false): Promise<AttendanceReport> => {
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
            date: format(new Date(date), 'M/d/yyyy'),  // Changed to match example format
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
          
          const report = {
            employeeId: id,
            employeeName: data.name,
            biNumber: employeeInfo?.biNumber || "000000000",
            department: employeeInfo?.department || "Not specified",
            company: employeeInfo?.company || "MYR HR Management",
            workingDays: data.workingDays,
            totalHours: Math.round(data.totalHours * 10) / 10,
            extraHours: Math.round(data.extraHours * 10) / 10,
            attendanceRecords: data.records
          };
          
          employeeReports.push(report);
          
          // If auto export is enabled, generate Excel for each employee
          if (autoExport) {
            generateEmployeeDeclarationExcel(report, month.toUpperCase(), year);
          }
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

// Function to generate Excel file for each employee's declaration (for backward compatibility)
export const generateEmployeeDeclarationExcel = (employeeReport: EmployeeReport, month: string, year: string) => {
  // Create a workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const wsName = "Declaration";
  
  // Create the declaration header
  const declarationText = [
    ["DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS"],
    [""],
    [`Eu, ${employeeReport.employeeName}, portador(a) do documento de identificação ${employeeReport.biNumber} e funcionário(a) da empresa ${employeeReport.company},`],
    ["venho por meio deste documento declarar o meu consentimento e aceitação para"],
    ["realizar horas extras de trabalho de acordo com as condições e termos"],
    ["estabelecidos pela legislação vigente e pela política interna da empresa."],
    ["Entendo que a necessidade de laborar horas extras pode surgir devido a"],
    ["circunstâncias excepcionais e/ou necessidades operacionais da empresa. Estou"],
    ["ciente de que serei compensado(a) adequadamente pelas horas extras"],
    ["trabalhadas de acordo com as regras e regulamentos aplicáveis."],
    [`A tabela a seguir detalha as horas extras a serem trabalhadas durante o`],
    [`mês de ${month} de ${year}:`],
    [""],
    [""],
    [""]
  ];
  
  // Create table headers
  const headers = ["Name", "Date", "Clock In", "Clock Out", "Work Time", "EXTRA HOURS"];
  
  // Prepare the data rows
  const dataRows = employeeReport.attendanceRecords.map(record => [
    employeeReport.employeeName,
    record.date,
    record.clockIn,
    record.clockOut,
    record.workTime,
    record.extraHours
  ]);
  
  // Add a row for the totals
  const totalRow = ["", "", "", "", formatTime(employeeReport.totalHours), ""];
  
  // Add summary rows
  const summaryRows = [
    [""],
    ["TOTAL WORKING HOURS", "", "", "", formatTime(employeeReport.totalHours), ""],
    ["WORKING DAYS", "", "", "", employeeReport.workingDays.toString(), ""],
    [""],
    ["Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima."],
    [""],
    ["Assinatura do Funcionário: ______________________________", "", "", "", `Data: ${format(new Date(), 'd')} DE ${month}`, ""]
  ];
  
  // Combine all the data
  const allData = [
    ...declarationText,
    headers,
    ...dataRows,
    totalRow,
    ...summaryRows
  ];
  
  // Create the worksheet
  const ws = XLSX.utils.aoa_to_sheet(allData);
  
  // Set column widths
  const wscols = [
    { wch: 20 },  // Name
    { wch: 12 },  // Date
    { wch: 10 },  // Clock In
    { wch: 10 },  // Clock Out
    { wch: 10 },  // Work Time
    { wch: 15 }   // EXTRA HOURS
  ];
  
  ws['!cols'] = wscols;
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, ws, wsName);
  
  // Generate file name
  const fileName = `${employeeReport.employeeName.replace(/,/g, '_').replace(/ /g, '_')}_Declaration_${month}_${year}`;
  
  // Generate the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save the file
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Register the export in attendance records
  registerExport(employeeReport.employeeId, fileName, 'xlsx');
};

// Register export in localStorage for tracking
export const registerExport = (employeeId: string, filename: string, fileType: string) => {
  try {
    // Get existing export records
    const exportRecordsStr = localStorage.getItem('bbq-export-records') || '[]';
    const exportRecords = JSON.parse(exportRecordsStr);
    
    // Add new record
    exportRecords.push({
      id: `export-${Date.now()}`,
      timestamp: new Date().toISOString(),
      employeeId: employeeId,
      filename,
      fileType,
      user: 'current-user' // In a real app, get this from auth context
    });
    
    // Save back to storage
    localStorage.setItem('bbq-export-records', JSON.stringify(exportRecords));
  } catch (error) {
    console.error('Error registering export:', error);
  }
};
