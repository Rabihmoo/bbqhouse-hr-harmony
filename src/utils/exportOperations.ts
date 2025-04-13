import * as XLSX from 'xlsx';
import { AttendanceRecord } from '@/types/attendance';
import { format } from 'date-fns';
import { 
  applyWorksheetStyling, 
  workbookToBlob,
  downloadExcelFile
} from './attendance/excelUtils';

/**
 * Export data as CSV file
 */
export const exportToCsv = (data: any[], filename: string, employeeId?: string) => {
  // Convert data to CSV string
  const header = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  );
  const csv = [header, ...rows].join('\n');
  
  // Create a blob and download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Register the export in attendance records
  registerExport(employeeId, filename, 'csv');
};

/**
 * Export data as Excel file with improved formatting
 */
export const exportToExcel = (data: any[], filename: string, employeeId?: string) => {
  // Convert data to worksheet with improved formatting
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // Apply comprehensive styling to make text readable and wrapped
  applyWorksheetStyling(worksheet, {
    headerRow: 0,
    boldRows: [0],
    columnWidths: data[0] ? Object.keys(data[0]).map(() => ({ wch: 20 })) : [] // Set reasonable column width
  });
  
  // Ensure text wrapping for all cells
  const range = XLSX.utils.decode_range(worksheet['!ref'] || "A1");
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell_address = XLSX.utils.encode_cell({ r, c });
      
      if (!worksheet[cell_address]) {
        worksheet[cell_address] = { t: 's', v: '' };
      }
      
      if (!worksheet[cell_address].s) {
        worksheet[cell_address].s = {};
      }
      
      // Set explicit text wrapping for all cells
      worksheet[cell_address].s.alignment = {
        wrapText: true,
        vertical: 'top',
        horizontal: 'left'
      };
    }
  }
  
  // Convert to blob with better options for text handling
  const excelBuffer = XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'array',
    bookSST: false, // Use shared string table for better text handling
    compression: true
  });
  
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  // Download using the helper function
  downloadExcelFile(blob, `${filename}.xlsx`);
  
  // Register the export in attendance records
  registerExport(employeeId, filename, 'xlsx');
};

/**
 * Register export in localStorage for tracking
 */
const registerExport = (employeeId?: string, filename?: string, fileType?: string) => {
  try {
    // Get existing export records
    const exportRecordsStr = localStorage.getItem('bbq-export-records') || '[]';
    const exportRecords = JSON.parse(exportRecordsStr);
    
    // Add new record
    exportRecords.push({
      id: `export-${Date.now()}`,
      timestamp: new Date().toISOString(),
      employeeId: employeeId || 'all',
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

/**
 * Prepare attendance data for export
 */
export const prepareAttendanceDataForExport = (records: AttendanceRecord[]) => {
  return records.map(record => ({
    'Employee': record.employeeName,
    'Date': record.date,
    'Clock In': record.clockIn || 'Not Recorded',
    'Clock Out': record.clockOut || 'Not Recorded',
    'Total Hours': record.totalHours,
    'Status': record.status.charAt(0).toUpperCase() + record.status.slice(1),
    'Notes': record.notes || ''
  }));
};

/**
 * Get file name with current date
 */
export const getExportFileName = (prefix: string) => {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  return `${prefix}_${currentDate}`;
};
