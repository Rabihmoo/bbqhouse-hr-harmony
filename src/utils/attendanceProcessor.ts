
import { employees } from "@/lib/data";
import { parse, format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface EmployeeAttendanceRecord {
  date: string;
  clockIn: string;
  clockOut: string;
  workTime: string;
  extraHours: string;
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
  attendanceRecords: EmployeeAttendanceRecord[];
}

export interface AttendanceReport {
  reportDate: string;
  month: string;
  year: string;
  employeeReports: EmployeeReport[];
}

// Format time as HH:MM
export const formatTime = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Calculate working hours and extra hours
export const calculateWorkingHours = (clockIn: string, clockOut: string): { workTime: string, extraHours: string } => {
  if (!clockIn || !clockOut || clockIn === 'FOLGA' || clockIn === 'nao entrada' || clockOut === 'nao saida') {
    if (clockIn === 'FOLGA') {
      return { workTime: '00:00', extraHours: '00:00' };
    }
    return { workTime: '04:30', extraHours: '00:00' };
  }

  try {
    // Parse time strings
    const [inHours, inMinutes] = clockIn.split(':').map(Number);
    const [outHours, outMinutes] = clockOut.split(':').map(Number);
    
    // Calculate total hours
    let totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight shifts
    
    const workHours = totalMinutes / 60;
    const workTime = formatTime(workHours);
    
    // Calculate extra hours
    const extraMinutes = Math.max(0, totalMinutes - 8 * 60); // 8 hours = 480 minutes
    const extraHourTime = extraMinutes > 0 ? formatTime(extraMinutes / 60) : '00:00';
    
    return { workTime, extraHours: extraHourTime };
  } catch (error) {
    console.error("Error calculating work time:", error);
    return { workTime: '00:00', extraHours: '00:00' };
  }
};

export const formatDateToPortuguese = (date: Date): string => {
  try {
    const day = date.getDate();
    const month = format(date, 'MMMM', { locale: ptBR });
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return format(new Date(), 'dd/MM/yyyy');
  }
};

export const processAttendanceData = (fileData: any): AttendanceReport => {
  // In a real implementation, this would parse the Excel file
  // For now, we'll simulate the data processing
  
  const currentDate = new Date();
  const month = format(currentDate, 'MMMM', { locale: ptBR });
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

// Function to generate declaration text
export const generateDeclarationText = (
  name: string, 
  biNumber: string, 
  company: string, 
  month: string,
  year: string
): string => {
  return `DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS

Eu, ${name}, portador(a) do documento de identificação ${biNumber} e funcionário(a) da empresa ${company},
venho por meio deste documento declarar o meu consentimento e aceitação para
realizar horas extras de trabalho de acordo com as condições e termos
estabelecidos pela legislação vigente e pela política interna da empresa.
Entendo que a necessidade de laborar horas extras pode surgir devido a
circunstâncias excepcionais e/ou necessidades operacionais da empresa. Estou
ciente de que serei compensado(a) adequadamente pelas horas extras
trabalhadas de acordo com as regras e regulamentos aplicáveis.
A tabela a seguir detalha as horas extras a serem trabalhadas durante o
mês de ${month} de ${year}:`;
};

// Function to generate signature text
export const generateSignatureText = (): string => {
  return `Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.

Assinatura do Funcionário: ______________________________         ${format(new Date(), 'dd/MM/yyyy')}`;
};
