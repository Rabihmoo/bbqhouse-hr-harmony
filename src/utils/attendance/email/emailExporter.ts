
import { AttendanceReport, EmployeeReport } from "../types";
import { sendEmailVia } from "../emailUtils";
import { formatTime } from "../timeCalculations";
import { generatePdfForEmployee } from "../pdf/pdfGenerator";
import * as XLSX from "xlsx";
import { toast } from "sonner";

/**
 * Send declarations via email
 */
export const sendDeclarationsViaEmail = async (
  email: string,
  reportData: AttendanceReport,
  filteredEmployees: EmployeeReport[],
  format: 'excel' | 'pdf' | 'both'
): Promise<void> => {
  try {
    // Calculate summary stats
    const totalEmployees = filteredEmployees.length;
    
    // Calculate total hours by parsing the string values
    let totalHoursValue = 0;
    filteredEmployees.forEach(emp => {
      const parts = emp.totalHours.split(':');
      if (parts.length === 2) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        totalHoursValue += hours + (minutes / 60);
      }
    });
    
    const totalWorkingDays = filteredEmployees.reduce((sum, emp) => sum + emp.workingDays, 0);
    
    // Prepare the attachments (Excel file is created in exportDeclarations.ts)
    const attachments = [`Employee_Declarations_${reportData.month}_${reportData.year}.xlsx`];
    
    if (format === 'pdf' || format === 'both') {
      for (const employee of filteredEmployees) {
        attachments.push(`${employee.employeeName.replace(/\s+/g, "_")}_Declaration_${reportData.month}_${reportData.year}.xlsx`);
      }
    }
    
    // Create email body with employee-specific subjects
    const employeeNames = filteredEmployees.map(emp => emp.employeeName).join(", ");
    const subject = filteredEmployees.length === 1 
      ? `Declaração de Horas Extras - ${filteredEmployees[0].employeeName}`
      : `Declarações de Horas Extras - ${reportData.month} ${reportData.year}`;
    
    const emailData = {
      to: email,
      subject: subject,
      body: `
        Por favor, confira anexo as declarações de horas extras para ${reportData.month} ${reportData.year}.
        
        Resumo:
        - Total de Funcionários: ${totalEmployees}
        - Total de Horas Trabalhadas: ${formatTime(totalHoursValue)}
        - Total de Dias Trabalhados: ${totalWorkingDays}
        
        Funcionários: ${employeeNames}
        
        Formato: ${format === 'both' ? 'Excel e PDF' : format.toUpperCase()}
        
        Esta é uma mensagem automática do Sistema de Gestão de RH.
      `,
      attachments: attachments,
      metadata: {
        reportMonth: reportData.month,
        reportYear: reportData.year,
        employeeCount: totalEmployees
      }
    };
    
    // Send email using notification service
    await sendEmailVia('employee', emailData);
    toast.success(`Email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    toast.error("Email sending failed");
    throw new Error("Email sending failed");
  }
};
