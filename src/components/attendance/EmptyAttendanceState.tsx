
import React from 'react';
import { Button } from "@/components/ui/button";

interface EmptyAttendanceStateProps {
  employeesWithoutAttendance: any[];
  onAddAttendance: () => void;
}

export const EmptyAttendanceState = ({
  employeesWithoutAttendance,
  onAddAttendance
}: EmptyAttendanceStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">No attendance records for this date.</p>
      {employeesWithoutAttendance.length > 0 && (
        <>
          <p className="mb-2">Employees without attendance records:</p>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 max-w-2xl mx-auto">
            {employeesWithoutAttendance.map(employee => (
              <div key={employee.id} className="border rounded-md p-2 text-sm">
                {employee.fullName}
              </div>
            ))}
          </div>
          <Button 
            className="mt-4"
            onClick={onAddAttendance}
          >
            Add Attendance Records
          </Button>
        </>
      )}
    </div>
  );
};
