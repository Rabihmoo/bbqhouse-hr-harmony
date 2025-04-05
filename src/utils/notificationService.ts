
import { toast } from "sonner";

// Define response types for type safety
interface EmailResponse {
  success: boolean;
  error?: string;
}

interface ExcelResponse {
  success: boolean;
  error?: string;
}

// Email notification service
export const sendEmailNotification = async (
  type: 'employee' | 'leave',
  data: any
): Promise<boolean> => {
  // Email configuration
  const emailConfig = {
    to: 'rabih.moughabat12@gmail.com',
    subject: 'MYR System Update - New Entry',
    body: formatEmailBody(type, data)
  };
  
  try {
    console.log(`Sending email notification for new ${type}:`, emailConfig);
    
    // In a real application, you would integrate with an email service API here
    // For now we'll simulate sending an email
    const response = await simulateEmailSending(emailConfig);
    
    if (response.success) {
      toast.success(`Email notification sent for new ${type}`);
      return true;
    } else {
      console.error('Failed to send email:', response.error);
      toast.error(`Failed to send email notification for new ${type}`);
      return false;
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
    toast.error(`Failed to send email notification for new ${type}`);
    return false;
  }
};

// Function to simulate email sending
const simulateEmailSending = async (emailConfig: any): Promise<EmailResponse> => {
  // This is a simulation - in production, you would call an actual email API
  console.log('Email would be sent with config:', emailConfig);
  
  // Simulate a successful response after a short delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

// Format email body based on data type
const formatEmailBody = (type: 'employee' | 'leave', data: any) => {
  if (type === 'employee') {
    return `
      A new employee has been added to the MYR System:
      
      Name: ${data.fullName}
      Position: ${data.position || 'Not specified'}
      Department: ${data.department || 'Not specified'}
      Email: ${data.email || 'Not specified'}
      Phone: ${data.phone || 'Not specified'}
      
      This is an automated notification from the MYR System Management platform.
    `;
  } else {
    return `
      A new leave request has been submitted:
      
      Employee: ${data.employeeName}
      Leave Type: ${data.type}
      Start Date: ${data.startDate}
      End Date: ${data.endDate}
      Days: ${data.days}
      Notes: ${data.notes || 'None'}
      
      This is an automated notification from the MYR System Management platform.
    `;
  }
};

// Excel export service
export const exportToExcel = async (
  type: 'employee' | 'leave',
  data: any
): Promise<boolean> => {
  try {
    console.log(`Exporting new ${type} data to Excel:`, data);
    
    // In a real application, you would integrate with a service to export to Excel
    // For demonstration purposes, we'll simulate the export
    const response = await simulateExcelExport(type, data);
    
    if (response.success) {
      toast.success(`Data exported to ${type}s Excel file`);
      return true;
    } else {
      console.error('Failed to export to Excel:', response.error);
      toast.error(`Failed to export ${type} data to Excel`);
      return false;
    }
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    toast.error(`Failed to export ${type} data to Excel`);
    return false;
  }
};

// Function to simulate Excel export
const simulateExcelExport = async (type: string, data: any): Promise<ExcelResponse> => {
  // This is a simulation - in production, you would call an actual export service or API
  console.log(`Excel export would save ${type} data:`, data);
  
  // Simulate a successful response after a short delay
  return new Promise(resolve => {
    setTimeout(() => {
      // Store the exported data in localStorage to simulate persistent storage
      const storageKey = `exported-${type}s`;
      const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingData.push({
        ...data,
        exportedAt: new Date().toISOString()
      });
      localStorage.setItem(storageKey, JSON.stringify(existingData));
      
      resolve({ success: true });
    }, 700);
  });
};
