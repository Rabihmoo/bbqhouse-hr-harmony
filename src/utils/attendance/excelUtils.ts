
import * as XLSX from "xlsx";
import { toast } from "sonner";

// Helper function to download a file
export const downloadExcelFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  toast.success(`${filename} downloaded`);
};

// Helper function to download PDF file
export const downloadPdfFile = (blob: Blob, filename: string): void => {
  // Ensure blob has the correct MIME type for PDF
  const pdfBlob = new Blob([blob], { type: 'application/pdf' });
  
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  toast.success(`${filename} downloaded`);
};

// Convert Excel workbook to JSON
export const ExcelToJSON = (workbook: XLSX.WorkBook): any[] => {
  const result: any[] = [];
  
  workbook.SheetNames.forEach(sheetName => {
    const ws = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
    result.push({
      sheetName: sheetName,
      data: json
    });
  });
  
  return result;
};

// Create a new workbook with a sheet
export const createWorkbookSheet = (
  data: any[][],
  sheetName: string = "Sheet1"
): XLSX.WorkBook => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return workbook;
};

// Convert workbook to blob
export const workbookToBlob = (workbook: XLSX.WorkBook): Blob => {
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
};

// Apply styling to a worksheet
export const applyWorksheetStyling = (
  worksheet: XLSX.WorkSheet, 
  options: {
    headerRow?: number,
    boldRows?: number[],
    mergedCells?: { 
      s: { r: number, c: number }, 
      e: { r: number, c: number } 
    }[],
    columnWidths?: { wch: number }[]
  }
): void => {
  // Set column widths if provided
  if (options.columnWidths) {
    worksheet['!cols'] = options.columnWidths;
  }
  
  // Set merged cells if provided
  if (options.mergedCells) {
    worksheet['!merges'] = options.mergedCells;
  }
  
  // Apply styling to cells
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
      
      // Add borders
      worksheet[cell_address].s.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
      
      // Make header row bold
      if (options.headerRow !== undefined && r === options.headerRow) {
        worksheet[cell_address].s.font = { bold: true };
        worksheet[cell_address].s.fill = { fgColor: { rgb: "EEEEEE" } };
      }
      
      // Make specific rows bold
      if (options.boldRows && options.boldRows.includes(r)) {
        if (!worksheet[cell_address].s.font) {
          worksheet[cell_address].s.font = {};
        }
        worksheet[cell_address].s.font.bold = true;
      }
    }
  }
};
