
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { attendanceRecords as attendanceData, statusColors } from "@/lib/data";
import { cn } from "@/lib/utils";
import AttendanceUploader from "@/components/employees/AttendanceUploader";
import { useEmployeeData } from "@/hooks/use-employee-data";

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [reportData, setReportData] = useState<any>(null);
  
  // Get only active employees
  const { employees: activeEmployees } = useEmployeeData(true);
  
  // Filter attendance records to only include active employees
  useEffect(() => {
    const activeEmployeeIds = activeEmployees.map(emp => emp.id);
    const activeAttendanceRecords = attendanceData.filter(record => 
      activeEmployeeIds.includes(record.employeeId)
    );
    setAttendanceRecords(activeAttendanceRecords);
  }, [activeEmployees]);
  
  const handleAttendanceReport = (data: any) => {
    setReportData(data);
    // In a production app, we would update attendance records with the processed data
    // For now, we'll just store the data
  };

  return (
    <DashboardLayout 
      title="Attendance Tracking" 
      subtitle="Monitor employee attendance and time records"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Daily Attendance</h2>
          <p className="text-muted-foreground">
            Track time entries and manage attendance records
          </p>
        </div>
        <AttendanceUploader onFileUploaded={handleAttendanceReport} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-black/40 glass rounded-xl p-6 card-hover">
          <h3 className="text-lg font-medium mb-2">Present</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">
              {attendanceRecords.filter(a => a.status === 'Present').length}
            </span>
            <span className="text-sm text-muted-foreground">
              of {attendanceRecords.length} employees
            </span>
          </div>
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500" 
              style={{ 
                width: `${(attendanceRecords.filter(a => a.status === 'Present').length / attendanceRecords.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-black/40 glass rounded-xl p-6 card-hover">
          <h3 className="text-lg font-medium mb-2">Absent</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">
              {attendanceRecords.filter(a => a.status === 'Absent').length}
            </span>
            <span className="text-sm text-muted-foreground">
              of {attendanceRecords.length} employees
            </span>
          </div>
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500" 
              style={{ 
                width: `${(attendanceRecords.filter(a => a.status === 'Absent').length / attendanceRecords.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-black/40 glass rounded-xl p-6 card-hover">
          <h3 className="text-lg font-medium mb-2">Late</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">
              {attendanceRecords.filter(a => a.status === 'Late').length}
            </span>
            <span className="text-sm text-muted-foreground">
              of {attendanceRecords.length} employees
            </span>
          </div>
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500" 
              style={{ 
                width: `${(attendanceRecords.filter(a => a.status === 'Late').length / attendanceRecords.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-black/40 glass rounded-xl p-6 card-hover">
          <h3 className="text-lg font-medium mb-2">Half Day</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">
              {attendanceRecords.filter(a => a.status === 'Half Day').length}
            </span>
            <span className="text-sm text-muted-foreground">
              of {attendanceRecords.length} employees
            </span>
          </div>
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
              style={{ 
                width: `${(attendanceRecords.filter(a => a.status === 'Half Day').length / attendanceRecords.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden">
        <DataTable
          data={attendanceRecords}
          columns={[
            {
              key: "employeeName",
              header: "Employee",
            },
            {
              key: "date",
              header: "Date",
            },
            {
              key: "timeIn",
              header: "Time In",
              render: (row) => (
                <span>{row.timeIn || "-"}</span>
              ),
            },
            {
              key: "timeOut",
              header: "Time Out",
              render: (row) => (
                <span>{row.timeOut || "-"}</span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (row) => (
                <span className={cn("px-2 py-1 rounded-full text-xs text-white", statusColors[row.status])}>
                  {row.status}
                </span>
              ),
            },
            {
              key: "reason",
              header: "Reason",
              render: (row) => (
                <span>{row.reason || "-"}</span>
              ),
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
