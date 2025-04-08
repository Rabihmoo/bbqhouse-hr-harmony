
import { AttendanceReport, EmployeeReport } from "../types";
import { sendEmailVia } from "../emailUtils";
import { formatTime } from "../timeCalculations";

/**
 * Send declarations via email
 */
export const sendDeclarationsViaEmail = async (
  email: string,
  reportData: AttendanceReport,
  filteredEmployees: EmployeeReport[],
  format: 'excel' | 'pdf' | 'both'
): Promise<void> => {
  // Calculate summary stats
  const totalEmployees = filteredEmployees.length;
  const totalHours = filteredEmployees.reduce((sum, emp) => sum + emp.totalHours, 0);
  const totalWorkingDays = filteredEmployees.reduce((sum, emp) => sum + emp.workingDays, 0);
  
  // Create email body
  const emailData = {
    to: email,
    subject: `Employee Declarations - ${reportData.month} ${reportData.year}`,
    body: `
      Please find attached the employee declarations for ${reportData.month} ${reportData.year}.
      
      Summary:
      - Total Employees: ${totalEmployees}
      - Total Working Hours: ${formatTime(totalHours)}
      - Total Working Days: ${totalWorkingDays}
      
      Format: ${format === 'both' ? 'Excel and PDF' : format.toUpperCase()}
      
      This is an automated email from the HR Management System.
    `,
    attachments: [`Employee_Declarations_${reportData.month}_${reportData.year}.xlsx`],
    metadata: {
      reportMonth: reportData.month,
      reportYear: reportData.year,
      employeeCount: totalEmployees
    }
  };
  
  // Send email using notification service
  await sendEmailVia('employee', emailData);
};
