
import { exportEmployeeDeclarations as exportDeclarations } from "./exportDeclarations";

// Re-export functions from exportDeclarations
export const exportEmployeeDeclarations = exportDeclarations;

// Function to update the dataProcessor to not auto-export on initial processing
export const updateDataProcessor = (processAttendanceData: any): any => {
  // This is a placeholder - in a real implementation, you might need to modify
  // the existing processAttendanceData function to not auto-export
  return processAttendanceData;
};
