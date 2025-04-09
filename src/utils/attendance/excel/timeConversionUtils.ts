
import * as XLSX from "xlsx";

/**
 * Utilities for converting time values for Excel spreadsheets
 */

/**
 * Convert time string (HH:MM) to Excel time value
 * Excel time is a decimal number between 0 and 1, where 0 is 00:00 and 1 is 24:00
 */
export const convertTimeStringToExcelTime = (timeString: string): number => {
  if (!timeString || timeString === '00:00') {
    return 0;
  }
  
  try {
    // Handle potential formatting issues
    let hours = 0;
    let minutes = 0;
    
    if (timeString.includes(':')) {
      // Handle standard HH:MM format
      [hours, minutes] = timeString.split(':').map(Number);
    } else if (!isNaN(Number(timeString))) {
      // Handle numeric format
      const numValue = Number(timeString);
      hours = Math.floor(numValue);
      minutes = Math.round((numValue - hours) * 60);
    }
    
    // Validate hours and minutes
    if (isNaN(hours) || isNaN(minutes)) {
      console.error(`Invalid time format: ${timeString}`);
      return 0;
    }
    
    // Excel time is represented as a fraction of a 24-hour day
    return (hours + minutes / 60) / 24;
  } catch (error) {
    console.error("Error converting time string to Excel time:", error);
    return 0;
  }
};

/**
 * Ensure time formatting is properly applied to all cells in a range
 */
export const ensureTimeFormatting = (
  ws: XLSX.WorkSheet, 
  fromCell: string, 
  toCell: string
): void => {
  const range = XLSX.utils.decode_range(`${fromCell}:${toCell}`);
  
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      
      if (ws[cellAddress]) {
        // If it's a string like "08:30", convert it to Excel time number
        if (typeof ws[cellAddress].v === 'string' && ws[cellAddress].v.includes(':')) {
          ws[cellAddress].v = convertTimeStringToExcelTime(ws[cellAddress].v);
          ws[cellAddress].t = 'n'; // Set cell type to number
        }
        
        // Apply time format
        ws[cellAddress].z = '[h]:mm';
      }
    }
  }
};
