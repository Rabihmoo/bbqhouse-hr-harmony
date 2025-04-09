
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
    const [hours, minutes] = timeString.split(':').map(Number);
    // Excel time is represented as a fraction of a 24-hour day
    return (hours + minutes / 60) / 24;
  } catch (error) {
    console.error("Error converting time string to Excel time:", error);
    return 0;
  }
};
